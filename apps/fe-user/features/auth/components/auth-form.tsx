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
import { UseFormRegister } from 'react-hook-form'
import { SchemaRegister } from '../api/auth'

interface AuthFormProps {
  register: UseFormRegister<SchemaRegister>
  emailError?: string
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => void
}

export function AuthForm({ register, emailError, isSubmitting, onSubmit }: AuthFormProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in or Sign up to MitraChain</CardTitle>
          <CardDescription>
            Create your account or log in to access your digital membership card
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@email.com"
                autoComplete="email"
                {...register('email')}
                disabled={isSubmitting}
              />
              {emailError && <p className="text-sm text-red-500">{emailError}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
