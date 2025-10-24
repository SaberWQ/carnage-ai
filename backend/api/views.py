"""API views"""
import numpy as np
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ai_engine.models import NeuralNetworkModel, TrainingHistory
from ai_engine.neural_network import NeuralNetwork
from .serializers import (
    NeuralNetworkSerializer, 
    TrainRequestSerializer, 
    PredictRequestSerializer
)


class AIModelViewSet(viewsets.ModelViewSet):
    """ViewSet for AI models"""
    serializer_class = NeuralNetworkSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return NeuralNetworkModel.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def train(self, request):
        """Train a new neural network"""
        serializer = TrainRequestSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        # Convert data to numpy arrays
        X = np.array(data['X'])
        y = np.array(data['y'])
        
        # Create and train neural network
        nn = NeuralNetwork(
            layers=data['layers'],
            activation=data['activation'],
            learning_rate=data['learning_rate']
        )
        
        losses = nn.train(X, y, epochs=data['epochs'], verbose=False)
        
        # Calculate final accuracy
        accuracy = nn.evaluate(X, y)
        final_loss = losses[-1]
        
        # Save model to database
        model = NeuralNetworkModel.objects.create(
            name=data['name'],
            user=request.user,
            layers=data['layers'],
            activation=data['activation'],
            learning_rate=data['learning_rate'],
            epochs=data['epochs'],
            weights=nn.get_weights()['weights'],
            biases=nn.get_weights()['biases'],
            accuracy=float(accuracy),
            loss=float(final_loss)
        )
        
        # Save training history (sample every 10 epochs)
        for i, loss in enumerate(losses):
            if i % 10 == 0 or i == len(losses) - 1:
                TrainingHistory.objects.create(
                    model=model,
                    epoch=i + 1,
                    loss=float(loss),
                    accuracy=float(nn.evaluate(X, y))
                )
        
        # Update user profile
        profile = request.user.profile
        profile.models_trained += 1
        profile.save()
        
        return Response({
            'model_id': model.id,
            'name': model.name,
            'accuracy': accuracy,
            'loss': final_loss,
            'message': 'Model trained successfully'
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['post'])
    def predict(self, request):
        """Make predictions with a trained model"""
        serializer = PredictRequestSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        # Get model
        try:
            model = NeuralNetworkModel.objects.get(
                id=data['model_id'],
                user=request.user
            )
        except NeuralNetworkModel.DoesNotExist:
            return Response(
                {'error': 'Model not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Load model weights
        nn = NeuralNetwork(
            layers=model.layers,
            activation=model.activation,
            learning_rate=model.learning_rate
        )
        nn.set_weights({
            'weights': model.weights,
            'biases': model.biases,
            'layers': model.layers,
            'activation': model.activation,
            'learning_rate': model.learning_rate
        })
        
        # Make predictions
        X = np.array(data['X'])
        predictions = nn.predict(X)
        probabilities = nn.forward(X)
        
        return Response({
            'predictions': predictions.tolist(),
            'probabilities': probabilities.tolist()
        })
