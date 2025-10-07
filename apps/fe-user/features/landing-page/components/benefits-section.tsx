import { Card, CardContent } from "@/components/ui/card"
import { Gift, Coins, TrendingUp, Shield, Users, Sparkles } from "lucide-react"
import Image from "next/image"

const benefits = [
  {
    icon: Gift,
    title: "Instant Rewards",
    description: "Earn points with every purchase at partner UMKM businesses",
  },
  {
    icon: Coins,
    title: "Redeemable Points",
    description: "Use your points for discounts and exclusive offers",
  },
  {
    icon: TrendingUp,
    title: "Growing Value",
    description: "Your loyalty grows in value as you engage with more businesses",
  },
  {
    icon: Shield,
    title: "Secure & Transparent",
    description: "Blockchain technology ensures your rewards are always safe",
  },
  {
    icon: Users,
    title: "Community Building",
    description: "Connect with local businesses and support your community",
  },
  {
    icon: Sparkles,
    title: "Exclusive Perks",
    description: "Access special deals and early access to new products",
  },
]

export function BenefitsSection() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            User Benefits
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl lg:text-5xl">
            Why Choose <span className="text-primary">Mitrachain</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Experience a new way to earn rewards while supporting local businesses in your community
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-primary/10 hover:border-primary/30 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="relative rounded-2xl border border-primary/20 bg-card p-4 max-w-3xl mx-auto">
          <Image
            src="/futuristic-illustration-smiling-user-receiving-dig.jpg"
            alt="User receiving rewards"
            width={800}
            height={400}
            className="rounded-xl w-full"
          />
        </div>
      </div>
    </section>
  )
}
