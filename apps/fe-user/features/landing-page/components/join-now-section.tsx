import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

export function JoinNowSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl border border-primary/20 bg-card/50 backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 bg-[url('/hexagon-pattern.svg')] opacity-5" />

          <div className="relative grid gap-12 lg:grid-cols-2 lg:gap-16 items-center p-8 md:p-12 lg:p-16">
            <div className="space-y-6">
              <div className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                Join the Network
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl lg:text-5xl">
                Ready to Start <span className="text-primary">Earning Rewards?</span>
              </h2>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Join thousands of users supporting local UMKM businesses while earning transparent, blockchain-secured
                rewards. Sign up today and get 100 bonus points!
              </p>

              <div className="flex flex-col gap-3 sm:flex-row pt-4">
                <Input type="email" placeholder="Enter your email" className="flex-1" />
                <Button size="lg" className="group">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-accent/30 blur-3xl" />
              <div className="relative">
                <Image
                  src="/inspiring-digital-illustration-people-reaching-tow.jpg"
                  alt="Join Mitrachain"
                  width={500}
                  height={500}
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
