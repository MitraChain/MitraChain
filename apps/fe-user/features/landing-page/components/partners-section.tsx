import { Button } from '@workspace/ui/components/button'
import { MapPin, Store } from 'lucide-react'
import Link from 'next/link'

export function PartnersSection() {
  return (
    <section id="partners" className="relative overflow-hidden bg-[#0a0f1e] py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d1425] via-[#0a0f1e] to-[#0a0f1e]" />

      <div className="container relative mx-auto px-6">
        <div className="mx-auto mb-16 max-w-3xl space-y-6 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Find{' '}
            <span className="bg-gradient-to-r from-[#0288D1] via-20% to-[#00c7c7] bg-clip-text text-transparent">
              Partner UMKM
            </span>
          </h2>
          <p className="text-pretty text-lg leading-relaxed text-gray-400">
            Discover local businesses in your area that are part of the Mitrachain network. Support
            your community while earning rewards.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="relative rounded-2xl border border-[#003366]/30 bg-[#0d1425]/50 p-8 backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Partner Locations</h3>
              <Button
                variant="outline"
                size="sm"
                className="border-[#003366]/50 bg-transparent text-white hover:bg-[#003366]/20"
              >
                <MapPin className="mr-2 h-4 w-4" />
                View Map
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  name: 'Warung Makan Sejahtera',
                  category: 'Restaurant',
                  location: 'Jakarta Selatan',
                },
                { name: 'Toko Kelontong Berkah', category: 'Grocery', location: 'Bandung' },
                { name: 'Salon Cantik Indah', category: 'Beauty', location: 'Surabaya' },
                { name: 'Bengkel Motor Jaya', category: 'Automotive', location: 'Yogyakarta' },
              ].map((partner, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-lg border border-white/10 bg-[#0a0f1e]/50 p-4 transition-all hover:border-[#00BCD4]/50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#003366]/30 to-[#0288D1]/30">
                    <Store className="h-6 w-6 text-[#00BCD4]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{partner.name}</h4>
                    <p className="text-sm text-gray-400">
                      {partner.category} • {partner.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link href="/memberships">
                <Button className="bg-gradient-to-r from-[#003366] to-[#0288D1] text-white shadow-lg shadow-[#00BCD4]/10 hover:opacity-90">
                  Explore All Partners
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
