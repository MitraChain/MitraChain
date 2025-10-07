import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import { Badge } from "@workspace/ui/components/badge"
import { Trophy, Star, Zap } from "lucide-react"
import Image from "next/image"

export function LoyaltyRewardsSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-block rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
              Loyalty & Rewards
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl lg:text-5xl">
              Track Your <span className="text-primary">Rewards Journey</span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Watch your loyalty grow with our transparent blockchain-based rewards system. Every point is tracked,
              every milestone is celebrated.
            </p>

            <div className="space-y-4 pt-4">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      Bronze Member
                    </span>
                    <Badge variant="secondary">Active</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress to Silver</span>
                      <span className="font-medium">750 / 1000 points</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 text-center p-3 rounded-lg bg-primary/10">
                      <div className="text-2xl font-bold text-primary">2,450</div>
                      <div className="text-xs text-muted-foreground">Total Points</div>
                    </div>
                    <div className="flex-1 text-center p-3 rounded-lg bg-accent/10">
                      <div className="text-2xl font-bold text-accent">15</div>
                      <div className="text-xs text-muted-foreground">Businesses</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg border border-primary/20">
                  <Star className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-sm font-medium">Silver</div>
                  <div className="text-xs text-muted-foreground">1K points</div>
                </div>
                <div className="text-center p-4 rounded-lg border border-accent/20">
                  <Star className="h-6 w-6 text-accent mx-auto mb-2" />
                  <div className="text-sm font-medium">Gold</div>
                  <div className="text-xs text-muted-foreground">5K points</div>
                </div>
                <div className="text-center p-4 rounded-lg border border-secondary/20">
                  <Zap className="h-6 w-6 text-secondary mx-auto mb-2" />
                  <div className="text-sm font-medium">Platinum</div>
                  <div className="text-xs text-muted-foreground">10K points</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 blur-2xl" />
            <div className="relative rounded-2xl border border-primary/20 bg-card p-4">
              <Image
                src="/clean-ui-style-illustration-smartphone-showing-loy.jpg"
                alt="Loyalty rewards dashboard"
                width={600}
                height={600}
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
