import { MembershipDetailView } from '@/features/memberships/components/membership-detail-view'

export default function MembershipDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-4 md:p-6">
      <MembershipDetailView membershipId={params.id} />
    </div>
  )
}
