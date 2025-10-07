import Image from "next/image"
import { Hexagon } from "lucide-react"

export function WhatIsSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 bg-gradient-to-br from-accent/20 to-primary/20 blur-2xl" />
            <div className="relative rounded-2xl border border-accent/20 bg-card p-4">
              <Image
                src="/modern-vector-illustration-user-profile-connected-.jpg"
                alt="Mitrachain ecosystem"
                width={500}
                height={500}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
              <Hexagon className="h-4 w-4" />
              What is Mitrachain
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl lg:text-5xl">
              A Transparent Ecosystem for <span className="text-primary">Local Business</span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Mitrachain is a blockchain-powered loyalty platform that connects customers with local UMKM businesses.
              Every transaction is transparent, every reward is secure, and every connection strengthens your community.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Hexagon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Blockchain Security</h3>
                  <p className="text-sm text-muted-foreground">
                    All rewards and transactions are secured on the blockchain
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <Hexagon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Support Local UMKM</h3>
                  <p className="text-sm text-muted-foreground">
                    Every purchase helps small businesses in your community thrive
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                  <Hexagon className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold">Complete Transparency</h3>
                  <p className="text-sm text-muted-foreground">
                    Track your rewards and see exactly how the system works
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
