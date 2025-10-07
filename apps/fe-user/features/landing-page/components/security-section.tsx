import { Card, CardContent } from "@workspace/ui/components/card"
import { Shield, Lock, Eye, CheckCircle } from "lucide-react"
import Image from "next/image"

const features = [
  {
    icon: Shield,
    title: "Blockchain Protected",
    description: "All transactions are secured on an immutable blockchain ledger",
  },
  {
    icon: Lock,
    title: "Encrypted Data",
    description: "Your personal information is encrypted and never shared",
  },
  {
    icon: Eye,
    title: "Full Transparency",
    description: "Track every point earned and redeemed in real-time",
  },
  {
    icon: CheckCircle,
    title: "Verified Partners",
    description: "All UMKM partners are verified and trusted businesses",
  },
]

export function SecuritySection() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl" />
            <div className="relative rounded-2xl border border-primary/20 bg-card p-4">
              <Image
                src="/glowing-shield-composed-of-geometric-interlinked-h.jpg"
                alt="Security and blockchain protection"
                width={500}
                height={500}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Shield className="h-4 w-4" />
              Security & Trust
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl lg:text-5xl">
              Why Mitrachain is <span className="text-primary">Secure</span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Built on blockchain technology, Mitrachain ensures every transaction is transparent, secure, and
              tamper-proof. Your rewards are always protected.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 pt-4">
              {features.map((feature, index) => (
                <Card key={index} className="border-primary/10">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
