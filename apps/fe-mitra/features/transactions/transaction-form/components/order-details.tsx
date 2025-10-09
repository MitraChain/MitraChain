'use client'

import { transformNumberToRupiahMask } from '@workspace/lib/maskito'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'

export default function OrderDetails({ membership, cartItems, totalAmount }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {membership && (
          <div>
            <h3 className="text-muted-foreground text-sm font-medium">Member</h3>
            <div className="mt-2 rounded-md border p-3">
              <p className="text-sm">Points: {membership.points}</p>
            </div>
          </div>
        )}
        <div>
          <h3 className="text-muted-foreground text-sm font-medium">Items</h3>
          <ul className="mt-2 divide-y rounded-md border">
            {cartItems.map((item: any) => (
              <li key={item.id} className="flex justify-between p-3">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {item.quantity} × {transformNumberToRupiahMask(item.price)}
                  </p>
                </div>
                <p className="font-medium">
                  {transformNumberToRupiahMask(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-lg font-semibold">Total Amount</p>
          <p className="text-lg font-semibold">{transformNumberToRupiahMask(totalAmount)}</p>
        </div>
      </CardContent>
    </Card>
  )
}
