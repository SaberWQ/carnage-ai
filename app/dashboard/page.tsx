import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Brain, Plus, Zap, Download } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user's models
  const { data: models } = await supabase
    .from("models")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Carnage AI</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/dashboard/models" className="text-sm text-muted-foreground hover:text-foreground">
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

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="mb-2 text-4xl font-bold">Welcome back!</h1>
          <p className="text-lg text-muted-foreground">Build and train neural networks for mobile devices</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <Card className="border-border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Create New Model</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Start building a new neural network with our visual builder
            </p>
            <Button asChild className="w-full">
              <Link href="/dashboard/models/new">Create Model</Link>
            </Button>
          </Card>

          <Card className="border-border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Train Model</h3>
            <p className="mb-4 text-sm text-muted-foreground">Train your models with custom datasets</p>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/dashboard/training">Start Training</Link>
            </Button>
          </Card>

          <Card className="border-border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Download className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Export Models</h3>
            <p className="mb-4 text-sm text-muted-foreground">Export to TFLite, ONNX, or CoreML formats</p>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/dashboard/export">Export</Link>
            </Button>
          </Card>
        </div>

        {/* Recent Models */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Models</h2>
            <Button asChild variant="outline">
              <Link href="/dashboard/models">View All</Link>
            </Button>
          </div>

          {models && models.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {models.slice(0, 6).map((model) => (
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
                <Link href="/dashboard/models/new">Create Your First Model</Link>
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
