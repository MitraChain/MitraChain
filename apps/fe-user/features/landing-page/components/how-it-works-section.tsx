import { Card, CardContent } from "@workspace/ui/components/card"
import { UserPlus, Store, QrCode, Award } from "lucide-react"
import Image from "next/image"

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Create Account",
    description: "Sign up in minutes and get your digital Mitrachain membership card",
  },
  {
    icon: Store,
    number: "02",
    title: "Choose UMKM",
    description: "Browse and select from hundreds of local partner businesses",
  },
  {
    icon: QrCode,
    number: "03",
    title: "Scan QR Code",
    description: "Make a purchase and scan the QR code at checkout",
  },
  {
    icon: Award,
    number: "04",
    title: "Earn Rewards",
    description: "Points are instantly added to your blockchain-secured wallet",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-block rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
            How It Works
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl lg:text-5xl">
            Get Started in <span className="text-primary">Four Simple Steps</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Join thousands of users earning transparent rewards from local businesses
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-accent/50" />
              )}
              <Card className="relative border-primary/10 hover:border-primary/30 transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-primary/20">{step.number}</div>
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="relative rounded-2xl border border-accent/20 bg-card p-4 max-w-4xl mx-auto">
          <Image
            src="/step-by-step-modern-illustration-user-creates-acco.jpg"
            alt="How Mitrachain works"
            width={900}
            height={400}
            className="rounded-xl w-full"
          />
        </div>
      </div>
    </section>
  )
}
