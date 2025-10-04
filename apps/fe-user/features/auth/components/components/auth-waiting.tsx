import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import { Loader2 } from 'lucide-react'

interface RegisterWaitingProps {
  email: string
  onResend: () => void
}

export function AuthWaiting({ email, onResend }: RegisterWaitingProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>We've sent you a verification link</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted rounded-lg border p-4">
            <p className="text-muted-foreground text-sm">
              Email sent to <strong className="text-foreground">{email}</strong>
            </p>
            <p className="text-muted-foreground mt-2 text-xs">
              Click the link in the email to continue
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed p-4">
            <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
            <p className="text-muted-foreground text-sm">Waiting for verification...</p>
          </div>

          <div className="text-muted-foreground space-y-2 text-center text-xs">
            <p>Didn't receive the email?</p>
            <Button variant="link" size="sm" onClick={onResend} className="h-auto p-0">
              Resend
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
