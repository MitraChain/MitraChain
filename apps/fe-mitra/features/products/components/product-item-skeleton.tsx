export function ProductItemSkeleton() {
  return (
    <div className="bg-card text-card-foreground flex items-center justify-between rounded-lg border p-4">
      <div className="flex-grow space-y-2">
        {/* Placeholder untuk Nama Produk */}
        <div className="bg-muted h-5 w-3/4 animate-pulse rounded-md"></div>
        {/* Placeholder untuk Harga */}
        <div className="bg-muted h-4 w-1/2 animate-pulse rounded-md"></div>
      </div>
      <div className="flex items-center gap-2">
        {/* Placeholder untuk tombol Edit */}
        <div className="bg-muted h-9 w-16 animate-pulse rounded-md"></div>
        {/* Placeholder untuk tombol Hapus */}
        <div className="bg-muted h-9 w-16 animate-pulse rounded-md"></div>
      </div>
    </div>
  )
}
