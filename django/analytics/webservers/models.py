############################################################
#  [*] Django Database Models
#
# This file defines all database tables used by the
# application. Django uses these model classes to create
# and manage the PostgreSQL schema via migrations.
#
# Changes to these models require running:
#   python3 manage.py makemigrations
#   python3 manage.py migrate
############################################################

import uuid
from django.db import models




# -------------------------------------------------------------------------
# Root-level domains (e.g. pavyzdys.lt).
# Tracks domain registration expiry and soft-delete via is_active flag.
# -------------------------------------------------------------------------

class Domain(models.Model):
    # Columns
    domain_name = models.CharField(max_length=253, unique=True)
    is_active = models.BooleanField(default=True)
    expires = models.DateField(null=True, blank=True)

    # Table metadata
    class Meta:
        db_table = "webservers_domain"
        ordering = ["id"]

    # String representation
    def __str__(self):
        return self.domain_name




# -------------------------------------------------------------------------
# Subdomains belonging to a domain (e.g. www.pavyzdys.lt, api.pavyzdys.lt).
# Each subdomain is scanned independently and tracked for availability.
# -------------------------------------------------------------------------

class Subdomain(models.Model):
    # Columns
    domain = models.ForeignKey('webservers.Domain', on_delete=models.CASCADE, related_name='subdomains')
    subdomain = models.CharField(max_length=253)
    date_scanned = models.DateField()
    is_active = models.BooleanField(default=True)

    # Table metadata
    class Meta:
        db_table = "webservers_subdomain"
        ordering = ["id"]
        constraints = [
            models.UniqueConstraint(
                fields=['domain', 'subdomain'],
                name='unique_subdomain_per_domain',
            ),
        ]

    # String representation
    def __str__(self):
        return self.subdomain




# -------------------------------------------------------------------------
# Cookie categories (e.g. Necessary, Functional, Analytics, Advertising).
# The gdpr_consent_required flag determines BDAR compliance requirement.
# -------------------------------------------------------------------------

class CookieCategory(models.Model):
    # Columns
    name = models.CharField(max_length=64, unique=True)
    gdpr_consent_required = models.BooleanField(default=True)

    # Table metadata
    class Meta:
        db_table = "webservers_cookiecategory"
        ordering = ["id"]
        verbose_name_plural = "cookie categories"

    # String representation
    def __str__(self):
        return self.name




# -------------------------------------------------------------------------
# HTTP response headers observed on a subdomain. Tracks observation
# windows (time_start → time_end). When a header disappears or its value
# changes, the row is closed and a new one is opened.
# -------------------------------------------------------------------------

class Header(models.Model):
    # Columns
    subdomain = models.ForeignKey('webservers.Subdomain', on_delete=models.CASCADE, related_name='headers')
    time_start = models.DateField()
    time_end = models.DateField()
    scan_closed = models.BooleanField(default=False)
    header_name = models.CharField(max_length=512)
    header_value = models.CharField(max_length=16384)

    # Table metadata
    class Meta:
        db_table = "webservers_header"
        ordering = ["id"]
        constraints = [
            models.UniqueConstraint(
                fields=['subdomain', 'header_name', 'header_value'],
                condition=models.Q(scan_closed=False),
                name='unique_open_header_per_subdomain',
            ),
        ]

    # String representation
    def __str__(self):
        return f'{self.header_name}: {self.header_value}'




# -------------------------------------------------------------------------
# Cookies found on a subdomain. Tracks observation windows
# (time_start → time_end). When a cookie disappears it is closed;
# if it reappears later a new row is created to preserve history.
# -------------------------------------------------------------------------

class Cookie(models.Model):
    # Columns
    subdomain = models.ForeignKey('webservers.Subdomain', on_delete=models.CASCADE, related_name='cookies')
    time_start = models.DateField()
    time_end = models.DateField()
    scan_closed = models.BooleanField(default=False)
    cookie_name = models.CharField(max_length=4096)
    category = models.ForeignKey('webservers.CookieCategory', on_delete=models.SET_NULL, null=True, blank=True, related_name='cookies')

    # Table metadata
    class Meta:
        db_table = "webservers_cookie"
        ordering = ["id"]
        constraints = [
            models.UniqueConstraint(
                fields=['subdomain', 'cookie_name'],
                condition=models.Q(scan_closed=False),
                name='unique_open_cookie_per_subdomain',
            ),
        ]

    # String representation
    def __str__(self):
        return self.cookie_name




# -------------------------------------------------------------------------
# Reference table from the Open Cookie Database. Used for automated
# categorization of discovered cookies. Supports wildcard matching
# (e.g. _ga_* → Analytics) via the wildcard_match flag.
# -------------------------------------------------------------------------

class OpenCookieDatabase(models.Model):
    # Columns
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    platform = models.CharField(max_length=4096, null=True, blank=True)
    category = models.ForeignKey('webservers.CookieCategory', on_delete=models.SET_NULL, null=True, blank=True, related_name='opencookies')
    cookie_name = models.CharField(max_length=4096)
    domain = models.CharField(max_length=4096, null=True, blank=True)
    description = models.CharField(max_length=4096, null=True, blank=True)
    retention_period = models.CharField(max_length=4096, null=True, blank=True)
    data_controller = models.CharField(max_length=4096, null=True, blank=True)
    privacy_rights_portals = models.CharField(max_length=4096, null=True, blank=True)
    wildcard_match = models.BooleanField(default=False)

    # Table metadata
    class Meta:
        db_table = "webservers_opencookiedatabase"
        ordering = []
        verbose_name = "open cookie database entry"
        verbose_name_plural = "open cookie database"

    # String representation
    def __str__(self):
        return self.cookie_name



