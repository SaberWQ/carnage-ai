/**
 * Neural Network Model Builder Component
 */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api"

export function ModelBuilder() {
  const [name, setName] = useState("")
  const [layers, setLayers] = useState("2,10,2")
  const [activation, setActivation] = useState("relu")
  const [learningRate, setLearningRate] = useState("0.01")
  const [epochs, setEpochs] = useState("1000")
  const [isTraining, setIsTraining] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleTrain = async () => {
    setIsTraining(true)
    setResult(null)

    try {
      // Example XOR dataset
      const X = [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ]
      const y = [
        [1, 0],
        [0, 1],
        [0, 1],
        [1, 0],
      ]

      const response = await api.trainModel({
        name,
        layers: layers.split(",").map(Number),
        activation,
        learning_rate: Number.parseFloat(learningRate),
        epochs: Number.parseInt(epochs),
        X,
        y,
      })

      setResult(response.data)
    } catch (error: any) {
      console.error("Training error:", error)
      setResult({ error: error.response?.data?.message || "Training failed" })
    } finally {
      setIsTraining(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Build Neural Network</CardTitle>
        <CardDescription>Configure and train your custom neural network</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Model Name</Label>
          <Input id="name" placeholder="My XOR Network" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="layers">Layers (comma-separated)</Label>
          <Input id="layers" placeholder="2,10,2" value={layers} onChange={(e) => setLayers(e.target.value)} />
          <p className="text-sm text-muted-foreground">Example: 2,10,2 means 2 inputs, 10 hidden neurons, 2 outputs</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="activation">Activation Function</Label>
          <Select value={activation} onValueChange={setActivation}>
            <SelectTrigger id="activation">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relu">ReLU</SelectItem>
              <SelectItem value="sigmoid">Sigmoid</SelectItem>
              <SelectItem value="tanh">Tanh</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="learning-rate">Learning Rate</Label>
            <Input
              id="learning-rate"
              type="number"
              step="0.001"
              value={learningRate}
              onChange={(e) => setLearningRate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="epochs">Epochs</Label>
            <Input id="epochs" type="number" value={epochs} onChange={(e) => setEpochs(e.target.value)} />
          </div>
        </div>

        <Button onClick={handleTrain} disabled={isTraining || !name} className="w-full">
          {isTraining ? "Training..." : "Train Model"}
        </Button>

        {result && (
          <Card className={result.error ? "border-destructive" : "border-green-500"}>
            <CardContent className="pt-6">
              {result.error ? (
                <p className="text-destructive">{result.error}</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-semibold">Model ID:</span> {result.model_id}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Accuracy:</span> {(result.accuracy * 100).toFixed(2)}%
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Loss:</span> {result.loss.toFixed(4)}
                  </p>
                  <p className="text-sm text-green-600">{result.message}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}
