'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Checkbox } from '@workspace/ui/components/checkbox'
import { Label } from '@workspace/ui/components/label'
import { Ticket } from 'lucide-react'

interface Props {
  vouchers: any[]
  selected: string[]
  setSelected: (ids: string[]) => void
}

export default function VoucherSelection({ vouchers, selected, setSelected }: Props) {
  if (!vouchers.length) return null

  const toggleVoucher = (id: string) =>
    setSelected(selected.includes(id) ? selected.filter((v) => v !== id) : [...selected, id])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-5 w-5" />
          Use NFT Vouchers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {vouchers.map((v: any) => (
          <div key={v.id} className="hover:bg-muted flex items-start gap-3 rounded-lg border p-3">
            <Checkbox
              id={v.id}
              checked={selected.includes(v.id)}
              onCheckedChange={() => toggleVoucher(v.id)}
            />
            <div className="flex-1">
              <Label htmlFor={v.id} className="cursor-pointer font-semibold">
                {v.reward_program_name}
              </Label>
              <p className="text-muted-foreground text-sm">{v.reward_description}</p>
            </div>
          </div>
        ))}
        {selected.length > 0 && (
          <p className="text-sm text-green-600">{selected.length} voucher(s) will be used</p>
        )}
      </CardContent>
    </Card>
  )
}
