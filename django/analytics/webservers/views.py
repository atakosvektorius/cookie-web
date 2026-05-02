############################################################
#  [*] Django API Views
#
# This file defines all API endpoints for the webservers 
# app. 
#
# Public endpoints:
#   GET  /django/api/webservers/getresults/<domain>
#   GET  /django/api/webservers/getcheckeddistribution
#
# Admin endpoints (require API_KEY):
#   POST /django/api/webservers/admin/cookies/push
#   POST /django/api/webservers/admin/domains/push
#   POST /django/api/webservers/admin/cookies/getwork
#   POST /django/api/webservers/admin/deletedcookies/getwork
############################################################

import os
from datetime import date

from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Count, Q

from .models import Domain, Subdomain, Cookie, Header, OpenCookieDatabase


FORBIDDEN_CHARS = set(' !@#$%^&*()[]{}|\'":;<>,?/\\`~')





# =========================================================================
# Helper: Validate API key from request body
# =========================================================================

def _validate_api_key(data):
    submitted_key = data.get('api_key', '')
    server_key = os.environ.get('API_KEY', '')
    if not submitted_key:
        return JsonResponse({'error': 'API key is required'}, status=400)
    if submitted_key.lower() != server_key.lower():
        return JsonResponse({'error': 'Invalid API key'}, status=401)
    return None


# =========================================================================
# Helper: Validate domain name characters
# =========================================================================

def _validate_domain_name(domain_name):
    for ch in domain_name:
        if ch in FORBIDDEN_CHARS:
            return False
    return True


# =========================================================================
# Helper: Categorize a cookie using OpenCookieDatabase
# =========================================================================

def _categorize_cookie(cookie_name):
    entry = OpenCookieDatabase.objects.filter(
        cookie_name=cookie_name, wildcard_match=False
    ).first()

    if not entry:
        entry = OpenCookieDatabase.objects.filter(
            wildcard_match=True
        ).extra(
            where=["%s LIKE cookie_name || '%%'"],
            params=[cookie_name]
        ).first()

    return entry.category if entry else None











# -------------------------------------------------------------------------
# GET /django/api/webservers/getresults/<domain>
# Public endpoint: returns cookies and BDAR compliance for a domain.
# -------------------------------------------------------------------------

@require_GET
def get_results(request, domain):
    domain = domain.lower()

    subdomain_qs = Subdomain.objects.filter(
        domain__domain_name=domain,
        domain__is_active=True,
        is_active=True,
    )

    is_scanned = subdomain_qs.exists()

    cookies_data = []
    if is_scanned:
        cookies = Cookie.objects.filter(
            subdomain__in=subdomain_qs,
            scan_closed=False,
        ).select_related('category', 'subdomain')

        for cookie in cookies:
            category_name = cookie.category.name if cookie.category else '?'

            is_allowed_bdar = False
            if cookie.category and not cookie.category.gdpr_consent_required:
                is_allowed_bdar = True

            cookies_data.append({
                'cookiename': cookie.cookie_name,
                'category': category_name,
                'datechecked': str(cookie.subdomain.date_scanned),
                'isallowedbdar': 1 if is_allowed_bdar else 0,
            })

    return JsonResponse({
        'isscanned': 1 if is_scanned else 0,
        'cookies': cookies_data,
    })





# -------------------------------------------------------------------------
# GET /django/api/webservers/getcheckeddistribution
# Public endpoint: returns scan distribution stats for admin dashboard.
# -------------------------------------------------------------------------

@require_GET
def get_checked_distribution(request):
    active_qs = Subdomain.objects.filter(is_active=True)
    inactive_qs = Subdomain.objects.filter(is_active=False)

    active_distribution = dict(
        active_qs.values_list('date_scanned')
        .annotate(count=Count('id'))
        .values_list('date_scanned', 'count')
    )

    inactive_distribution = dict(
        inactive_qs.values_list('date_scanned')
        .annotate(count=Count('id'))
        .values_list('date_scanned', 'count')
    )

    active_distribution = {str(k): v for k, v in active_distribution.items()}
    inactive_distribution = {str(k): v for k, v in inactive_distribution.items()}

    return JsonResponse({
        'total_active_domains': active_qs.count(),
        'total_inactive_domains': inactive_qs.count(),
        'active_domains': active_distribution,
        'inactive_domains': inactive_distribution,
    }, json_dumps_params={'indent': 4})





# -------------------------------------------------------------------------
# POST /django/api/webservers/admin/cookies/push
# Admin endpoint: push scan results (cookies + headers) for a subdomain.
# Uses the time_start/time_end/scan_closed pattern for history tracking.
# -------------------------------------------------------------------------

@csrf_exempt
@require_POST
def cookies_push(request):
    import json
    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, ValueError):
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    if not data:
        return JsonResponse({'error': 'No data provided'}, status=400)

    error_response = _validate_api_key(data)
    if error_response:
        return error_response

    submitted_domain_name = data.get('domain_name', '').lower()
    if not submitted_domain_name:
        return JsonResponse({'error': 'Domain name is required'}, status=400)
    if not _validate_domain_name(submitted_domain_name):
        return JsonResponse({'error': 'Domain name contains forbidden characters'}, status=400)

    action = data.get('action', '').lower()
    if not action:
        return JsonResponse({'error': 'Action is required'}, status=400)

    today = date.today()

    if action == 'update':
        submitted_cookies = data.get('cookies', [])
        if not isinstance(submitted_cookies, list):
            return JsonResponse({'error': 'Cookies must be an array'}, status=400)

        submitted_headers = data.get('headers')
        if submitted_headers and not isinstance(submitted_headers, dict):
            return JsonResponse({'error': 'Headers must be an object'}, status=400)

        domain_obj, _ = Domain.objects.get_or_create(
            domain_name=submitted_domain_name,
            defaults={'is_active': True},
        )
        domain_obj.is_active = True
        domain_obj.save()

        subdomain_name = data.get('subdomain', '').lower()
        subdomain_obj, _ = Subdomain.objects.get_or_create(
            domain=domain_obj,
            subdomain=subdomain_name,
            defaults={'date_scanned': today, 'is_active': True},
        )
        subdomain_obj.date_scanned = today
        subdomain_obj.is_active = True
        subdomain_obj.save()

        # --- Cookies: close missing, update existing, create new ---
        open_cookies = Cookie.objects.filter(
            subdomain=subdomain_obj, scan_closed=False
        )
        submitted_cookie_set = set(c for c in submitted_cookies if c)

        for existing in open_cookies:
            if existing.cookie_name not in submitted_cookie_set:
                existing.scan_closed = True
                existing.time_end = today
                existing.save()
            else:
                existing.time_end = today
                existing.save()
                submitted_cookie_set.discard(existing.cookie_name)

        for cookie_name in submitted_cookie_set:
            category = _categorize_cookie(cookie_name)
            Cookie.objects.create(
                subdomain=subdomain_obj,
                cookie_name=cookie_name,
                category=category,
                time_start=today,
                time_end=today,
                scan_closed=False,
            )

        # --- Headers: close missing, update existing, create new ---
        if submitted_headers and isinstance(submitted_headers, dict):
            open_headers = Header.objects.filter(
                subdomain=subdomain_obj, scan_closed=False
            )
            submitted_header_set = set()
            for name, value in submitted_headers.items():
                submitted_header_set.add((name, value))

            for existing in open_headers:
                key = (existing.header_name, existing.header_value)
                if key not in submitted_header_set:
                    existing.scan_closed = True
                    existing.time_end = today
                    existing.save()
                else:
                    existing.time_end = today
                    existing.save()
                    submitted_header_set.discard(key)

            for header_name, header_value in submitted_header_set:
                Header.objects.create(
                    subdomain=subdomain_obj,
                    header_name=header_name,
                    header_value=header_value,
                    time_start=today,
                    time_end=today,
                    scan_closed=False,
                )

        return JsonResponse({'message': 'Cookies pushed successfully'}, status=200)

    elif action == 'delete':
        try:
            domain_obj = Domain.objects.get(domain_name=submitted_domain_name)
        except Domain.DoesNotExist:
            return JsonResponse({'message': 'Domain not found'}, status=404)

        subdomain_name = data.get('subdomain', '').lower()
        subdomains = Subdomain.objects.filter(
            domain=domain_obj, subdomain=subdomain_name
        ) if subdomain_name else domain_obj.subdomains.all()

        for sub in subdomains:
            Cookie.objects.filter(subdomain=sub, scan_closed=False).update(
                scan_closed=True, time_end=today
            )
            Header.objects.filter(subdomain=sub, scan_closed=False).update(
                scan_closed=True, time_end=today
            )
            sub.is_active = False
            sub.date_scanned = today
            sub.save()

        return JsonResponse({'message': 'Domain deleted successfully'}, status=200)

    else:
        return JsonResponse({'error': 'Invalid submit action'}, status=400)





# -------------------------------------------------------------------------
# POST /django/api/webservers/admin/domains/push
# Admin endpoint: bulk push new domains into the database.
# -------------------------------------------------------------------------

@csrf_exempt
@require_POST
def domains_push(request):
    import json
    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, ValueError):
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    if not data:
        return JsonResponse({'error': 'No data provided'}, status=400)

    error_response = _validate_api_key(data)
    if error_response:
        return error_response

    submitted_domains = data.get('domains', [])
    if not isinstance(submitted_domains, list):
        return JsonResponse({'error': 'Domains must be an array'}, status=400)

    created = 0
    for domain_name in submitted_domains:
        domain_name = domain_name.lower().strip()
        if not domain_name or not _validate_domain_name(domain_name):
            continue

        _, was_created = Domain.objects.get_or_create(
            domain_name=domain_name,
            defaults={'is_active': True},
        )
        if was_created:
            created += 1

    return JsonResponse({
        'message': 'Domains pushed successfully',
        'created': created,
    }, status=200)





# -------------------------------------------------------------------------
# POST /django/api/webservers/admin/cookies/getwork
# Admin endpoint: returns oldest subdomains that need rescanning.
# -------------------------------------------------------------------------

@csrf_exempt
@require_POST
def cookies_getwork(request):
    import json
    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, ValueError):
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    if not data:
        return JsonResponse({'error': 'No data provided'}, status=400)

    error_response = _validate_api_key(data)
    if error_response:
        return error_response

    limit = int(data.get('limit', 50))
    if limit < 1 or limit > 100:
        return JsonResponse({'error': 'Limit must be between 1 and 100'}, status=400)

    oldest = Subdomain.objects.filter(
        is_active=True
    ).order_by('date_scanned')[:500]

    import random
    selected = random.sample(list(oldest), min(limit, len(oldest)))

    domains = [{
        'domain_name': sub.domain.domain_name,
        'subdomain': sub.subdomain,
        'date_checked': str(sub.date_scanned),
    } for sub in selected]

    return JsonResponse({'domains': domains})





# -------------------------------------------------------------------------
# POST /django/api/webservers/admin/deletedcookies/getwork
# Admin endpoint: returns oldest inactive subdomains for re-checking.
# -------------------------------------------------------------------------

@csrf_exempt
@require_POST
def deleted_cookies_getwork(request):
    import json
    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, ValueError):
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    if not data:
        return JsonResponse({'error': 'No data provided'}, status=400)

    error_response = _validate_api_key(data)
    if error_response:
        return error_response

    limit = int(data.get('limit', 50))
    if limit < 1 or limit > 100:
        return JsonResponse({'error': 'Limit must be between 1 and 100'}, status=400)

    oldest = Subdomain.objects.filter(
        is_active=False
    ).order_by('date_scanned')[:500]

    import random
    selected = random.sample(list(oldest), min(limit, len(oldest)))

    domains = [{
        'domain_name': sub.domain.domain_name,
        'subdomain': sub.subdomain,
        'date_checked': str(sub.date_scanned),
    } for sub in selected]

    return JsonResponse({'domains': domains})
