/**
 * Home page - Dashboard
 */
import { ModelBuilder } from "@/components/model-builder"
import { ModelList } from "@/components/model-list"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Carnage AI</h1>
          <p className="text-muted-foreground text-lg">
            Build, train, and deploy lightweight neural networks on mobile devices
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <ModelBuilder />
          </div>
          <div>
            <ModelList />
          </div>
        </div>
      </div>
    </main>
  )
}
