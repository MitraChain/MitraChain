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
import {
  SchemaCreateBusiness,
  schemaCreateBusiness,
  useCreateBusiness,
} from '../api/create-business'

export function CreateBusinessForm() {
  const { mutate, isPending } = useCreateBusiness()

  const form = useForm<SchemaCreateBusiness>({
    resolver: zodResolver(schemaCreateBusiness),
    defaultValues: {
      name: '',
      address: '',
    },
  })

  const onSubmit = (values: SchemaCreateBusiness) => {
    mutate(values)
  }

  return (
    <div className="spmx-auto mx-auto flex h-full w-full max-w-md flex-col items-center justify-center">
      <div className="text-left">
        <h1 className="text-4xl font-bold tracking-tight">Welcome!</h1>
        <p className="text-muted-foreground text-lg">
          One more step. Let's create your business to get started.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 w-full space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Sunset Coffee" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 123 Coffee St." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Saving...' : 'Continue'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
