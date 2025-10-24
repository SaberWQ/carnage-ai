"""User admin"""
from django.contrib import admin
from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'subscription_tier', 'models_trained', 'storage_used', 'created_at']
    list_filter = ['subscription_tier', 'created_at']
    search_fields = ['user__username', 'user__email']
