import { Button } from '@workspace/ui/components/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-[#0a0f1e] py-24">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-[#0d1425] to-[#0a0f1e]" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#003366]/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#003366]/40 bg-[#0d1425]/50 p-12 text-center shadow-lg shadow-[#00BCD4]/5 backdrop-blur-sm">
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Ready to Join the{' '}
            <span className="bg-gradient-to-r from-[#0288D1] via-20% to-[#00c7c7] bg-clip-text text-transparent">
              Future
            </span>
            ?
          </h2>
          <p className="mb-8 text-pretty text-lg leading-relaxed text-gray-400">
            Start building transparent, secure relationships with local businesses today. Experience
            the power of blockchain-based memberships on Cardano.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/auth">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-[#003366] to-[#0288D1] text-white shadow-lg shadow-[#00BCD4]/10 hover:opacity-90"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
