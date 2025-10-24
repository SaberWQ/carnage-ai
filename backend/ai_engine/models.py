"""Database models for AI Engine"""
from django.db import models
from django.contrib.auth.models import User


class NeuralNetworkModel(models.Model):
    """Model to store trained neural networks"""
    
    name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='models')
    
    # Architecture
    layers = models.JSONField(help_text="List of layer sizes, e.g., [2, 10, 2]")
    activation = models.CharField(max_length=50, default='relu')
    
    # Training parameters
    learning_rate = models.FloatField(default=0.01)
    epochs = models.IntegerField(default=1000)
    
    # Model weights (stored as JSON)
    weights = models.JSONField(null=True, blank=True)
    biases = models.JSONField(null=True, blank=True)
    
    # Metadata
    accuracy = models.FloatField(null=True, blank=True)
    loss = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.user.username}"


class TrainingHistory(models.Model):
    """Store training history for each model"""
    
    model = models.ForeignKey(NeuralNetworkModel, on_delete=models.CASCADE, related_name='history')
    epoch = models.IntegerField()
    loss = models.FloatField()
    accuracy = models.FloatField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['epoch']
    
    def __str__(self):
        return f"{self.model.name} - Epoch {self.epoch}"
