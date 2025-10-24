import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Brain, ArrowLeft, Trash2, Zap } from "lucide-react"
import Link from "next/link"

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: model } = await supabase
    .from("models")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle()

  if (!model) {
    notFound()
  }

  const layers = model.architecture?.layers || []

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Carnage AI</span>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/models">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Models
            </Link>
          </Button>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <h1 className="text-4xl font-bold">{model.name}</h1>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  model.status === "trained"
                    ? "bg-green-500/10 text-green-500"
                    : model.status === "training"
                      ? "bg-yellow-500/10 text-yellow-500"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {model.status}
              </span>
            </div>
            <p className="text-lg text-muted-foreground">
              {model.description || "No description provided"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Zap className="mr-2 h-4 w-4" />
              Train Model
            </Button>
            <Button variant="outline" className="text-destructive hover:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="border-border bg-card p-6">
            <h2 className="mb-6 text-2xl font-bold">Model Architecture</h2>
            {layers.length > 0 ? (
              <div className="space-y-3">
                {layers.map((layer: { type: string; units?: number; activation?: string; filters?: number; kernelSize?: number; poolSize?: number; rate?: number }, index: number) => (
                  <Card key={index} className="border-border bg-muted/50 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            Layer {index + 1}
                          </span>
                          <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {layer.type}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm">
                          {layer.type === "dense" && (
                            <>
                              <p>Units: {layer.units}</p>
                              <p>Activation: {layer.activation}</p>
                            </>
                          )}
                          {layer.type === "conv2d" && (
                            <>
                              <p>Filters: {layer.filters}</p>
                              <p>Kernel Size: {layer.kernelSize}</p>
                              <p>Activation: {layer.activation}</p>
                            </>
                          )}
                          {layer.type === "maxpool" && <p>Pool Size: {layer.poolSize}</p>}
                          {layer.type === "dropout" && <p>Rate: {layer.rate}</p>}
                          {layer.type === "flatten" && <p>Flattens the input</p>}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No layers defined</p>
            )}
          </Card>

          <Card className="border-border bg-card p-6">
            <h2 className="mb-6 text-2xl font-bold">Model Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="text-lg capitalize">{model.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Layers</p>
                <p className="text-lg">{layers.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p className="text-lg">
                  {new Date(model.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="text-lg">
                  {new Date(model.updated_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
