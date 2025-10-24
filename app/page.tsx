"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Brain, Zap, Smartphone, Download } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
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
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <Link href="#docs" className="text-sm text-muted-foreground hover:text-foreground">
              Docs
            </Link>
            <Button asChild variant="outline" size="sm">
              <Link href="/auth/login">Log in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <div className="mb-6 inline-block rounded-full bg-accent px-4 py-1.5 text-sm text-accent-foreground">
          Mobile AI Platform
        </div>
        <h1 className="mb-6 text-balance text-6xl font-bold leading-tight tracking-tight">
          Build neural networks for <span className="text-primary">mobile devices</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-balance text-lg text-muted-foreground">
          Create, train, and deploy lightweight neural networks optimized for mobile. Visual builder, on-device
          training, and multi-format export.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button asChild size="lg" className="gap-2">
            <Link href="/auth/sign-up">
              Start building <Zap className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="#features">Learn more</Link>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold">Everything you need</h2>
          <p className="text-lg text-muted-foreground">Build, train, and deploy neural networks for mobile devices</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-border bg-card p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Visual Builder</h3>
            <p className="text-muted-foreground">
              Drag-and-drop interface for building neural network architectures without code
            </p>
          </Card>

          <Card className="border-border bg-card p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Mobile Training</h3>
            <p className="text-muted-foreground">Train models directly on mobile devices with optimized algorithms</p>
          </Card>

          <Card className="border-border bg-card p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Download className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Multi-Format Export</h3>
            <p className="text-muted-foreground">Export to TFLite, ONNX, CoreML for any mobile platform</p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <Card className="border-border bg-gradient-to-br from-primary/10 to-primary/5 p-12 text-center">
          <h2 className="mb-4 text-4xl font-bold">Ready to start building?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Join developers building intelligent mobile applications with Carnage AI
          </p>
          <Button asChild size="lg">
            <Link href="/auth/sign-up">Get started for free</Link>
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="font-bold">Carnage AI</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 Carnage AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
