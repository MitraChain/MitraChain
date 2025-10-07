import { Card, CardContent } from '@workspace/ui/components/card'
import Link from 'next/link'
import { MembershipWithBusiness } from '../api/get-user-memberships'

interface MembershipCardProps {
  membership: MembershipWithBusiness
}

export function MembershipCard({ membership }: MembershipCardProps) {
  return (
    <Link href={`/memberships/${membership.id}`} className="block">
      <Card className="hover:bg-muted/50 flex transition-colors">
        <CardContent>
          <h3 className="text-lg font-semibold">
            {membership.businesses?.name || 'Unknown Business'}
          </h3>
          <p className="text-muted-foreground text-sm">{membership.businesses?.address}</p>
          <p className="text-muted-foreground text-sm">{membership.points} points</p>
        </CardContent>
      </Card>
    </Link>
  )
}
