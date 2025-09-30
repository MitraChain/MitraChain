'use client'

import { Button } from '@workspace/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog'
import { Input } from '@workspace/ui/components/input'
import { useState } from 'react'
import { toast } from 'sonner'
import { useGetProducts } from '../api/get-products'
import ProductForm from './product-form'
import ProductItem from './product-item'

export function ProductsView() {
  const { data, error, isLoading } = useGetProducts()
  const [openCreate, setOpenCreate] = useState(false)
  const [search, setSearch] = useState('')

  const products = (data ?? []).filter((p) =>
    p.name.toLowerCase().includes(search.trim().toLowerCase()),
  )

  // useEffect(() => {
  //   const supabase = createClient()
  //   supabase.auth.signInWithPassword({ email: 'vnusoo123@gmail.com', password: 'Yuhuu123' })
  // }, [])

  if (error) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground text-sm">
          There was an error loading products. {String(error?.message || '')}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-pretty text-xl font-semibold">Products</h1>
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button>Add product</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New product</DialogTitle>
            </DialogHeader>
            <ProductForm
              onSuccess={async () => {
                // await mutate()
                setOpenCreate(false)
                toast.success('Product created')
              }}
              onCancel={() => setOpenCreate(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="font-sans"
        />
      </div>

      {isLoading ? (
        <div className="text-muted-foreground text-sm">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-muted-foreground text-sm">No products found.</div>
      ) : (
        <div className="grid gap-3">
          {products.map((p) => (
            <ProductItem key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
