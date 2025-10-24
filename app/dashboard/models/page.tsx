import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Brain, Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function ModelsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: models } = await supabase
    .from("models")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Carnage AI</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/dashboard/models" className="text-sm font-medium">
              Models
            </Link>
            <Link href="/dashboard/training" className="text-sm text-muted-foreground hover:text-foreground">
              Training
            </Link>
            <form action="/api/auth/signout" method="post">
              <Button variant="outline" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold">Your Models</h1>
            <p className="text-lg text-muted-foreground">Manage your neural network models</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/models/new">
              <Plus className="mr-2 h-4 w-4" />
              New Model
            </Link>
          </Button>
        </div>

        {models && models.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {models.map((model) => (
              <Card key={model.id} className="border-border bg-card p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
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
                <h3 className="mb-2 font-semibold">{model.name}</h3>
                <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                  {model.description || "No description"}
                </p>
                <div className="mb-4 text-xs text-muted-foreground">
                  {model.architecture?.layers?.length || 0} layers
                </div>
                <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
                  <Link href={`/dashboard/models/${model.id}`}>View Model</Link>
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-border bg-card p-12 text-center">
            <Brain className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold">No models yet</h3>
            <p className="mb-6 text-muted-foreground">Create your first neural network to get started</p>
            <Button asChild>
              <Link href="/dashboard/models/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Model
              </Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
