import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import { QrCode as QrCodeIcon } from 'lucide-react'

export function MembershipListCard() {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Memberships in SMEs</CardTitle>
        <CardDescription>List of SMEs where you are registered as a member</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground py-12 text-center">
          <QrCodeIcon className="mx-auto mb-4 h-12 w-12 opacity-20" />
          <p className="font-medium">You are not registered in any SMEs</p>
          <p className="mt-2 text-sm">
            Show the QR code above to the cashier to register as a member
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
