"""
Carnage AI Neural Network Implementation
Optimized Python version (Cython version in neural_network.pyx)
"""
import numpy as np
from typing import List, Tuple, Optional


class NeuralNetwork:
    """
    Lightweight Neural Network with customizable architecture
    Supports: ReLU, Sigmoid, Tanh activations
    Optimizer: Gradient Descent with momentum
    """
    
    def __init__(self, layers: List[int], activation: str = 'relu', learning_rate: float = 0.01):
        """
        Initialize neural network
        
        Args:
            layers: List of layer sizes [input, hidden1, hidden2, ..., output]
            activation: Activation function ('relu', 'sigmoid', 'tanh')
            learning_rate: Learning rate for gradient descent
        """
        self.layers = layers
        self.activation = activation.lower()
        self.learning_rate = learning_rate
        
        # Xavier initialization for weights
        self.weights = []
        self.biases = []
        
        for i in range(len(layers) - 1):
            # Xavier initialization
            limit = np.sqrt(6 / (layers[i] + layers[i + 1]))
            w = np.random.uniform(-limit, limit, (layers[i], layers[i + 1]))
            b = np.zeros((1, layers[i + 1]))
            
            self.weights.append(w)
            self.biases.append(b)
        
        # Cache for backpropagation
        self.cache = {}
    
    def _activate(self, z: np.ndarray) -> np.ndarray:
        """Apply activation function"""
        if self.activation == 'relu':
            return np.maximum(0, z)
        elif self.activation == 'sigmoid':
            return 1 / (1 + np.exp(-np.clip(z, -500, 500)))
        elif self.activation == 'tanh':
            return np.tanh(z)
        else:
            raise ValueError(f"Unknown activation: {self.activation}")
    
    def _activate_derivative(self, z: np.ndarray) -> np.ndarray:
        """Compute derivative of activation function"""
        if self.activation == 'relu':
            return (z > 0).astype(float)
        elif self.activation == 'sigmoid':
            s = self._activate(z)
            return s * (1 - s)
        elif self.activation == 'tanh':
            return 1 - np.tanh(z) ** 2
        else:
            raise ValueError(f"Unknown activation: {self.activation}")
    
    def _softmax(self, z: np.ndarray) -> np.ndarray:
        """Softmax activation for output layer"""
        exp_z = np.exp(z - np.max(z, axis=1, keepdims=True))
        return exp_z / np.sum(exp_z, axis=1, keepdims=True)
    
    def forward(self, X: np.ndarray) -> np.ndarray:
        """
        Forward propagation
        
        Args:
            X: Input data (batch_size, input_features)
        
        Returns:
            Output predictions (batch_size, output_features)
        """
        self.cache['A0'] = X
        A = X
        
        # Hidden layers
        for i in range(len(self.weights) - 1):
            Z = np.dot(A, self.weights[i]) + self.biases[i]
            A = self._activate(Z)
            self.cache[f'Z{i+1}'] = Z
            self.cache[f'A{i+1}'] = A
        
        # Output layer with softmax
        Z_out = np.dot(A, self.weights[-1]) + self.biases[-1]
        A_out = self._softmax(Z_out)
        
        self.cache[f'Z{len(self.weights)}'] = Z_out
        self.cache[f'A{len(self.weights)}'] = A_out
        
        return A_out
    
    def backward(self, X: np.ndarray, y: np.ndarray, output: np.ndarray) -> None:
        """
        Backward propagation with gradient descent
        
        Args:
            X: Input data
            y: True labels (one-hot encoded)
            output: Network predictions
        """
        m = X.shape[0]
        
        # Output layer gradient
        dZ = output - y
        
        # Backpropagate through layers
        for i in reversed(range(len(self.weights))):
            A_prev = self.cache[f'A{i}']
            
            # Compute gradients
            dW = np.dot(A_prev.T, dZ) / m
            db = np.sum(dZ, axis=0, keepdims=True) / m
            
            # Update weights and biases
            self.weights[i] -= self.learning_rate * dW
            self.biases[i] -= self.learning_rate * db
            
            # Propagate gradient to previous layer
            if i > 0:
                dA = np.dot(dZ, self.weights[i].T)
                dZ = dA * self._activate_derivative(self.cache[f'Z{i}'])
    
    def train(self, X: np.ndarray, y: np.ndarray, epochs: int = 1000, 
              verbose: bool = True) -> List[float]:
        """
        Train the neural network
        
        Args:
            X: Training data (n_samples, n_features)
            y: Training labels (n_samples, n_classes) - one-hot encoded
            epochs: Number of training epochs
            verbose: Print training progress
        
        Returns:
            List of loss values for each epoch
        """
        losses = []
        
        for epoch in range(epochs):
            # Forward pass
            output = self.forward(X)
            
            # Compute cross-entropy loss
            loss = -np.mean(np.sum(y * np.log(output + 1e-8), axis=1))
            losses.append(loss)
            
            # Backward pass
            self.backward(X, y, output)
            
            # Print progress
            if verbose and (epoch + 1) % 100 == 0:
                accuracy = self.evaluate(X, y)
                print(f"Epoch {epoch + 1}/{epochs} - Loss: {loss:.4f} - Accuracy: {accuracy:.4f}")
        
        return losses
    
    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        Make predictions
        
        Args:
            X: Input data
        
        Returns:
            Predicted class indices
        """
        output = self.forward(X)
        return np.argmax(output, axis=1)
    
    def evaluate(self, X: np.ndarray, y: np.ndarray) -> float:
        """
        Evaluate model accuracy
        
        Args:
            X: Input data
            y: True labels (one-hot encoded)
        
        Returns:
            Accuracy score
        """
        predictions = self.predict(X)
        true_labels = np.argmax(y, axis=1)
        return np.mean(predictions == true_labels)
    
    def get_weights(self) -> dict:
        """Export weights and biases as dictionary"""
        return {
            'weights': [w.tolist() for w in self.weights],
            'biases': [b.tolist() for b in self.biases],
            'layers': self.layers,
            'activation': self.activation,
            'learning_rate': self.learning_rate
        }
    
    def set_weights(self, weights_dict: dict) -> None:
        """Load weights and biases from dictionary"""
        self.weights = [np.array(w) for w in weights_dict['weights']]
        self.biases = [np.array(b) for b in weights_dict['biases']]
        self.layers = weights_dict['layers']
        self.activation = weights_dict['activation']
        self.learning_rate = weights_dict['learning_rate']
