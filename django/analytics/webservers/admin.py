############################################################
#  [*] Django Admin Configuration
#
# This file registers all webservers models with the Django
# admin interface and configures how they are displayed,
# filtered, and searched.
#
# Inline models allow editing related records directly
# from a parent record's admin page.
#
# OpenCookieDatabase has a custom CSV import action
# accessible via the "Import from CSV" button.
############################################################

import csv
import io
import uuid

from django.contrib import admin
from django.shortcuts import render, redirect
from django.urls import path
from django.contrib import messages

from .models import Domain, Subdomain, CookieCategory, Header, Cookie, OpenCookieDatabase





# -------------------------------------------------------------------------
# Inline: Subdomains shown inside the Domain admin page.
# -------------------------------------------------------------------------

class SubdomainInline(admin.TabularInline):
    model = Subdomain
    extra = 0
    fields = ['subdomain', 'date_scanned', 'is_active']




# -------------------------------------------------------------------------
# Inline: Headers shown inside the Subdomain admin page.
# -------------------------------------------------------------------------

class HeaderInline(admin.TabularInline):
    model = Header
    extra = 0
    fields = ['header_name', 'header_value', 'time_start', 'time_end', 'scan_closed']




# -------------------------------------------------------------------------
# Inline: Cookies shown inside the Subdomain admin page.
# -------------------------------------------------------------------------

class CookieInline(admin.TabularInline):
    model = Cookie
    extra = 0
    fields = ['cookie_name', 'category', 'time_start', 'time_end', 'scan_closed']




# -------------------------------------------------------------------------
# Domain Admin: Lists all top-level domains with soft-delete filter.
# Subdomains are editable inline.
# -------------------------------------------------------------------------

@admin.register(Domain)
class DomainAdmin(admin.ModelAdmin):
    list_display = ['domain_name', 'is_active', 'expires']
    list_filter = ['is_active']
    search_fields = ['domain_name']
    inlines = [SubdomainInline]




# -------------------------------------------------------------------------
# Subdomain Admin: Lists subdomains with availability status.
# Headers and cookies are editable inline.
# -------------------------------------------------------------------------

@admin.register(Subdomain)
class SubdomainAdmin(admin.ModelAdmin):
    list_display = ['subdomain', 'domain', 'date_scanned', 'is_active']
    list_filter = ['is_active', 'domain']
    search_fields = ['subdomain', 'domain__domain_name']
    inlines = [HeaderInline, CookieInline]




# -------------------------------------------------------------------------
# CookieCategory Admin: Manages the lookup table for cookie categories.
# -------------------------------------------------------------------------

@admin.register(CookieCategory)
class CookieCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'gdpr_consent_required']
    list_filter = ['gdpr_consent_required']




# -------------------------------------------------------------------------
# Header Admin: Lists all observed HTTP headers with scan status.
# -------------------------------------------------------------------------

@admin.register(Header)
class HeaderAdmin(admin.ModelAdmin):
    list_display = ['header_name', 'header_value', 'subdomain', 'time_start', 'time_end', 'scan_closed']
    list_filter = ['scan_closed', 'header_name']
    search_fields = ['header_name', 'header_value', 'subdomain__subdomain']




# -------------------------------------------------------------------------
# Cookie Admin: Lists all observed cookies with category and scan status.
# -------------------------------------------------------------------------

@admin.register(Cookie)
class CookieAdmin(admin.ModelAdmin):
    list_display = ['cookie_name', 'category', 'subdomain', 'time_start', 'time_end', 'scan_closed']
    list_filter = ['scan_closed', 'category']
    search_fields = ['cookie_name', 'subdomain__subdomain']




# -------------------------------------------------------------------------
# OpenCookieDatabase Admin: Reference table for automated cookie
# categorization. Filterable by wildcard, category, and platform.
# -------------------------------------------------------------------------

@admin.register(OpenCookieDatabase)
class OpenCookieDatabaseAdmin(admin.ModelAdmin):
    list_display = ['id', 'cookie_name', 'platform', 'category', 'domain', 'description', 'retention_period', 'data_controller', 'wildcard_match']
    search_fields = ['cookie_name', 'platform', 'domain', 'description']
    ordering = []
    change_list_template = 'admin/webservers/opencookiedatabase/change_list.html'

    # Custom URLs
    def get_urls(self):
        custom_urls = [
            path('import-csv/', self.admin_site.admin_view(self.import_csv), name='opencookiedatabase_import_csv'),
        ]
        return custom_urls + super().get_urls()


    # Import CSV action
    def import_csv(self, request):
        if request.method == 'POST' and request.FILES.get('csv_file'):
            csv_file = request.FILES['csv_file']

            try:
                decoded = csv_file.read().decode('utf-8')
            except UnicodeDecodeError:
                messages.error(request, 'File must be UTF-8 encoded CSV.')
                return redirect('..')

            reader = csv.DictReader(io.StringIO(decoded))

            created = 0
            updated = 0
            errors = 0

            for row_num, row in enumerate(reader, start=2):
                try:
                    row_id = row.get('ID', '').strip()
                    if not row_id:
                        continue

                    try:
                        entry_uuid = uuid.UUID(row_id)
                    except ValueError:
                        errors += 1
                        continue

                    category_name = row.get('Category', '').strip()
                    category_obj = None
                    if category_name:
                        category_obj, _ = CookieCategory.objects.get_or_create(name=category_name)

                    wildcard_raw = row.get('Wildcard match', '0').strip()
                    wildcard = wildcard_raw in ('1', 'true', 'True', 'yes')

                    defaults = {
                        'platform': row.get('Platform', '').strip() or None,
                        'category': category_obj,
                        'cookie_name': row.get('Cookie / Data Key name', '').strip(),
                        'domain': row.get('Domain', '').strip() or None,
                        'description': row.get('Description', '').strip() or None,
                        'retention_period': row.get('Retention period', '').strip() or None,
                        'data_controller': row.get('Data Controller', '').strip() or None,
                        'privacy_rights_portals': row.get('User Privacy & GDPR Rights Portals', '').strip() or None,
                        'wildcard_match': wildcard,
                    }

                    _, was_created = OpenCookieDatabase.objects.update_or_create(
                        id=entry_uuid,
                        defaults=defaults,
                    )

                    if was_created:
                        created += 1
                    else:
                        updated += 1

                except Exception as e:
                    errors += 1

            messages.success(request, f'Import complete: {created} created, {updated} updated, {errors} errors.')
            return redirect('..')

        return render(request, 'admin/webservers/opencookiedatabase/import_csv.html', {
            'title': 'Import Open Cookie Database from CSV',
            'opts': self.model._meta,
        })


