import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import { CheckCircle2 } from 'lucide-react'

export function AuthSuccess() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            <CardTitle>Email Verified!</CardTitle>
          </div>
          <CardDescription>Your account has been successfully created</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-green-50 p-4 dark:bg-green-950">
            <p className="text-sm text-green-800 dark:text-green-200">
              Verification successful! Preparing your wallet...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
