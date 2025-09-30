export function formatCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0, // Rupiah doesn't use cents
    maximumFractionDigits: 0,
  })

  return formatter.format(amount)
}
