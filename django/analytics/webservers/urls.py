############################################################
#  [*] Django URL Configuration — Webservers App
#
# Maps API endpoints to their corresponding view functions.
# All paths are relative to wherever this app is included
# in the project-level urls.py.
############################################################

from django.urls import path
from . import views

urlpatterns = [
    # Public endpoints
    path('webservers/getresults/<str:domain>', views.get_results, name='get_results'),
    path('webservers/getcheckeddistribution', views.get_checked_distribution, name='get_checked_distribution'),

    # Admin endpoints
    path('webservers/admin/cookies/push', views.cookies_push, name='cookies_push'),
    path('webservers/admin/domains/push', views.domains_push, name='domains_push'),
    path('webservers/admin/cookies/getwork', views.cookies_getwork, name='cookies_getwork'),
    path('webservers/admin/deletedcookies/getwork', views.deleted_cookies_getwork, name='deleted_cookies_getwork'),
]
