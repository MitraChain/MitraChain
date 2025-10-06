import { Card, CardContent, CardFooter, CardHeader } from '@workspace/ui/components/card'

export function MembershipCardSkeleton() {
  return (
    <Card className="flex animate-pulse flex-col justify-between">
      <CardHeader>
        <div className="bg-muted h-6 w-3/4 rounded-md"></div>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex flex-col items-start">
        <div className="bg-muted h-4 w-1/2 rounded-md"></div>
        <div className="bg-muted mt-2 h-2 w-full rounded-md"></div>
      </CardFooter>
    </Card>
  )
}
