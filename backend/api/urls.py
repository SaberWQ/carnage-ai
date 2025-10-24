"""API URLs"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AIModelViewSet

router = DefaultRouter()
router.register(r'models', AIModelViewSet, basename='models')

urlpatterns = [
    path('', include(router.urls)),
]
