############################################################
#  [*] Django Admin Configuration
#
# This file registers all webservers models with the Django
# admin interface and configures how they are displayed,
# filtered, and searched.
#
# Inline models allow editing related records directly
# from a parent record's admin page.
############################################################

from django.contrib import admin
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
    list_display = ['cookie_name', 'platform', 'category', 'domain', 'wildcard_match']
    list_filter = ['wildcard_match', 'category', 'platform']
    search_fields = ['cookie_name', 'platform', 'domain', 'description']


