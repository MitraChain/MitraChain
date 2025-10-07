import { MembershipDetailView } from '@/features/memberships/components/membership-detail-view'

export default async function MembershipDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <div className="p-4 md:p-6">
      <MembershipDetailView membershipId={id} />
    </div>
  )
}
