'use client'

import { createClient } from '@/lib/supabase/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form'
import { Input } from '@workspace/ui/components/input'
import { Tabs, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
})

export function AuthForm() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('signin')
  const [authError, setAuthError] = useState<string | null>(null)
  const [authMessage, setAuthMessage] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { isSubmitting } = form.formState

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setAuthError(null)
    setAuthMessage(null)
    const supabase = createClient()

    if (activeTab === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (error) {
        setAuthError(error.message)
      } else {
        router.push('/') // Redirect to dashboard or home on successful sign in
        router.refresh() // Refresh to update server-side session state
      }
    } else {
      // 'signup' tab
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}`,
        },
      })

      if (error) {
        setAuthError(error.message)
      } else {
        setAuthMessage('Check your email to confirm your registration!')
        form.reset()
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <Card>
          <CardHeader>
            <CardTitle>{activeTab === 'signin' ? 'Sign In' : 'Sign Up'}</CardTitle>
            <CardDescription>
              {activeTab === 'signin'
                ? 'Welcome back! Sign in to your account.'
                : 'Create a new account to get started.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : activeTab === 'signin' ? 'Sign In' : 'Sign Up'}
                </Button>
                {authError && <p className="mt-2 text-center text-sm text-red-600">{authError}</p>}
                {authMessage && (
                  <p className="mt-2 text-center text-sm text-green-600">{authMessage}</p>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}
