'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@workspace/ui/components/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form'
import { Input } from '@workspace/ui/components/input'
import { useForm } from 'react-hook-form'
import { SchemaSignup, schemaSignup, useSignup } from '../api/signup'

export default function SignupForm() {
  const signupMutation = useSignup()

  const form = useForm<SchemaSignup>({
    resolver: zodResolver(schemaSignup),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (values: SchemaSignup) => {
    signupMutation.mutate(values)
  }

  return (
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
                <Input type="password" placeholder="Enter password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={signupMutation.isPending}>
          {signupMutation.isPending ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>
    </Form>
  )
}
