"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Brain, Plus, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"

type Layer = {
  id: string
  type: "dense" | "conv2d" | "maxpool" | "dropout" | "flatten"
  units?: number
  activation?: string
  filters?: number
  kernelSize?: number
  poolSize?: number
  rate?: number
}

export default function NewModelPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [layers, setLayers] = useState<Layer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addLayer = (type: Layer["type"]) => {
    const newLayer: Layer = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      ...(type === "dense" && { units: 128, activation: "relu" }),
      ...(type === "conv2d" && { filters: 32, kernelSize: 3, activation: "relu" }),
      ...(type === "maxpool" && { poolSize: 2 }),
      ...(type === "dropout" && { rate: 0.5 }),
    }
    setLayers([...layers, newLayer])
  }

  const removeLayer = (id: string) => {
    setLayers(layers.filter((layer) => layer.id !== id))
  }

  const updateLayer = (id: string, updates: Partial<Layer>) => {
    setLayers(layers.map((layer) => (layer.id === id ? { ...layer, ...updates } : layer)))
  }

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Please enter a model name")
      return
    }

    if (layers.length === 0) {
      setError("Please add at least one layer")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Not authenticated")
      }

      const { data, error } = await supabase
        .from("models")
        .insert({
          user_id: user.id,
          name,
          description,
          architecture: { layers },
          status: "draft",
        })
        .select()
        .single()

      if (error) throw error

      router.push(`/dashboard/models/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save model")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Carnage AI</span>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Create New Model</h1>
          <p className="text-lg text-muted-foreground">Build your neural network architecture</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Model Configuration */}
          <div>
            <Card className="border-border bg-card p-6">
              <h2 className="mb-6 text-2xl font-bold">Model Configuration</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Model Name</Label>
                  <Input
                    id="name"
                    placeholder="My Neural Network"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your model..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="mb-3 block">Add Layers</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => addLayer("dense")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Dense
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => addLayer("conv2d")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Conv2D
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => addLayer("maxpool")}>
                      <Plus className="mr-2 h-4 w-4" />
                      MaxPool
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => addLayer("dropout")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Dropout
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => addLayer("flatten")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Flatten
                    </Button>
                  </div>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button onClick={handleSave} disabled={isLoading} className="w-full">
                  {isLoading ? "Saving..." : "Save Model"}
                </Button>
              </div>
            </Card>
          </div>

          {/* Architecture Preview */}
          <div>
            <Card className="border-border bg-card p-6">
              <h2 className="mb-6 text-2xl font-bold">Architecture Preview</h2>

              {layers.length === 0 ? (
                <div className="flex h-64 items-center justify-center text-center">
                  <div>
                    <Brain className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">No layers added yet</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {layers.map((layer, index) => (
                    <Card key={layer.id} className="border-border bg-muted/50 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">Layer {index + 1}</span>
                            <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              {layer.type}
                            </span>
                          </div>

                          {layer.type === "dense" && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Label className="text-xs">Units:</Label>
                                <Input
                                  type="number"
                                  value={layer.units}
                                  onChange={(e) => updateLayer(layer.id, { units: Number.parseInt(e.target.value) })}
                                  className="h-7 w-20 text-xs"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <Label className="text-xs">Activation:</Label>
                                <select
                                  value={layer.activation}
                                  onChange={(e) => updateLayer(layer.id, { activation: e.target.value })}
                                  className="h-7 rounded-md border border-input bg-background px-2 text-xs"
                                >
                                  <option value="relu">ReLU</option>
                                  <option value="sigmoid">Sigmoid</option>
                                  <option value="tanh">Tanh</option>
                                  <option value="softmax">Softmax</option>
                                </select>
                              </div>
                            </div>
                          )}

                          {layer.type === "conv2d" && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Label className="text-xs">Filters:</Label>
                                <Input
                                  type="number"
                                  value={layer.filters}
                                  onChange={(e) => updateLayer(layer.id, { filters: Number.parseInt(e.target.value) })}
                                  className="h-7 w-20 text-xs"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <Label className="text-xs">Kernel Size:</Label>
                                <Input
                                  type="number"
                                  value={layer.kernelSize}
                                  onChange={(e) =>
                                    updateLayer(layer.id, { kernelSize: Number.parseInt(e.target.value) })
                                  }
                                  className="h-7 w-20 text-xs"
                                />
                              </div>
                            </div>
                          )}

                          {layer.type === "maxpool" && (
                            <div className="flex items-center gap-2">
                              <Label className="text-xs">Pool Size:</Label>
                              <Input
                                type="number"
                                value={layer.poolSize}
                                onChange={(e) => updateLayer(layer.id, { poolSize: Number.parseInt(e.target.value) })}
                                className="h-7 w-20 text-xs"
                              />
                            </div>
                          )}

                          {layer.type === "dropout" && (
                            <div className="flex items-center gap-2">
                              <Label className="text-xs">Rate:</Label>
                              <Input
                                type="number"
                                step="0.1"
                                min="0"
                                max="1"
                                value={layer.rate}
                                onChange={(e) => updateLayer(layer.id, { rate: Number.parseFloat(e.target.value) })}
                                className="h-7 w-20 text-xs"
                              />
                            </div>
                          )}
                        </div>

                        <Button variant="ghost" size="sm" onClick={() => removeLayer(layer.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
