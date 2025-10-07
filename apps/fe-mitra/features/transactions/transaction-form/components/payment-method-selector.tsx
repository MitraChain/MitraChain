'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Label } from '@workspace/ui/components/label'
import { RadioGroup, RadioGroupItem } from '@workspace/ui/components/radio-group'
import { Banknote, CreditCard } from 'lucide-react'

interface Props {
  value: 'cash' | 'qris'
  onChange: (v: 'cash' | 'qris') => void
}

export default function PaymentMethodSelector({ value, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={value} onValueChange={(v) => onChange(v as any)}>
          <div className="flex items-center space-x-3 rounded-lg border p-4">
            <RadioGroupItem value="cash" id="cash" />
            <Label htmlFor="cash" className="flex flex-1 cursor-pointer items-center gap-3">
              <Banknote className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="font-medium">Cash</p>
                <p className="text-muted-foreground text-sm">Pay with physical cash</p>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-lg border p-4">
            <RadioGroupItem value="qris" id="qris" />
            <Label htmlFor="qris" className="flex flex-1 cursor-pointer items-center gap-3">
              <CreditCard className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="font-medium">QRIS</p>
                <p className="text-muted-foreground text-sm">Scan QR with e-wallet</p>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
