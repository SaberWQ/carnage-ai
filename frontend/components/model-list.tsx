/**
 * Model List Component
 */
"use client"

import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"

const fetcher = () => api.getModels().then((res) => res.data)

export function ModelList() {
  const { data: models, error, mutate } = useSWR("/models/", fetcher)

  const handleDelete = async (id: number) => {
    try {
      await api.deleteModel(id)
      mutate()
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  if (error) return <div className="text-destructive">Failed to load models</div>
  if (!models) return <div className="text-muted-foreground">Loading...</div>

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Models</h2>
      {models.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">No models yet. Create your first one!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {models.map((model: any) => (
            <Card key={model.id}>
              <CardHeader>
                <CardTitle className="text-lg">{model.name}</CardTitle>
                <CardDescription>
                  {model.layers.join(" → ")} ({model.activation})
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="font-semibold">Accuracy:</span> {(model.accuracy * 100).toFixed(2)}%
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Loss:</span> {model.loss.toFixed(4)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Created: {new Date(model.created_at).toLocaleDateString()}
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(model.id)} className="w-full mt-2">
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
