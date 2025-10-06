import Container from '@/components/container'
import { Card, CardContent } from '@workspace/ui/components/card'

export default function MembershipsPage() {
  return (
    <Container>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My Memberships</h1>
        <p className="text-muted-foreground mt-1">All your loyalty cards in one place.</p>
      </header>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <p className="font-semibold">Business Name {i}</p>
              <p className="text-muted-foreground text-sm">8 / 10 Stamps</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  )
}
