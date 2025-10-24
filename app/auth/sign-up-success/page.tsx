import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">Carnage AI</span>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Thank you for signing up!</CardTitle>
            <CardDescription>Check your email to confirm</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You&apos;ve successfully signed up. Please check your email to confirm your account before signing in.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
