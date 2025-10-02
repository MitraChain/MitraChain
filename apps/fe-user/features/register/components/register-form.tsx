import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { Loader2 } from 'lucide-react'

interface RegisterFormProps {
  email: string
  emailError?: string
  isSubmitting: boolean
  onEmailChange: (email: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function RegisterForm({
  email,
  emailError,
  isSubmitting,
  onEmailChange,
  onSubmit,
}: RegisterFormProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Daftar MitraChain</CardTitle>
          <CardDescription>Buat akun untuk mendapatkan kartu member digital Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                autoComplete="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                disabled={isSubmitting}
              />
              {emailError && <p className="text-sm text-red-500">{emailError}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Daftar'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
