"""User models"""
from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    """Extended user profile"""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    subscription_tier = models.CharField(
        max_length=20,
        choices=[
            ('free', 'Free'),
            ('premium', 'Premium'),
            ('enterprise', 'Enterprise'),
        ],
        default='free'
    )
    models_trained = models.IntegerField(default=0)
    storage_used = models.FloatField(default=0.0, help_text="Storage in MB")
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.subscription_tier}"
