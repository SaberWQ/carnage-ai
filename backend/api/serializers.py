"""API serializers"""
from rest_framework import serializers
from ai_engine.models import NeuralNetworkModel, TrainingHistory


class TrainingHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingHistory
        fields = ['epoch', 'loss', 'accuracy', 'timestamp']


class NeuralNetworkSerializer(serializers.ModelSerializer):
    history = TrainingHistorySerializer(many=True, read_only=True)
    
    class Meta:
        model = NeuralNetworkModel
        fields = ['id', 'name', 'layers', 'activation', 'learning_rate', 
                  'epochs', 'accuracy', 'loss', 'created_at', 'updated_at', 'history']
        read_only_fields = ['id', 'created_at', 'updated_at', 'accuracy', 'loss']


class TrainRequestSerializer(serializers.Serializer):
    """Serializer for training request"""
    name = serializers.CharField(max_length=255)
    layers = serializers.ListField(child=serializers.IntegerField(min_value=1))
    activation = serializers.ChoiceField(choices=['relu', 'sigmoid', 'tanh'], default='relu')
    learning_rate = serializers.FloatField(min_value=0.0001, max_value=1.0, default=0.01)
    epochs = serializers.IntegerField(min_value=1, max_value=10000, default=1000)
    X = serializers.ListField(child=serializers.ListField(child=serializers.FloatField()))
    y = serializers.ListField(child=serializers.ListField(child=serializers.FloatField()))


class PredictRequestSerializer(serializers.Serializer):
    """Serializer for prediction request"""
    model_id = serializers.IntegerField()
    X = serializers.ListField(child=serializers.ListField(child=serializers.FloatField()))
