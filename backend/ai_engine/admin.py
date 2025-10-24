"""Admin configuration for AI Engine"""
from django.contrib import admin
from .models import NeuralNetworkModel, TrainingHistory


@admin.register(NeuralNetworkModel)
class NeuralNetworkModelAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'layers', 'activation', 'accuracy', 'created_at']
    list_filter = ['activation', 'created_at']
    search_fields = ['name', 'user__username']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(TrainingHistory)
class TrainingHistoryAdmin(admin.ModelAdmin):
    list_display = ['model', 'epoch', 'loss', 'accuracy', 'timestamp']
    list_filter = ['model', 'timestamp']
    search_fields = ['model__name']
