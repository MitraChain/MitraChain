import { Shield, Zap, Users } from "lucide-react"

export function AboutSection() {
  return (
    <section id="about" className="relative py-24 overflow-hidden bg-[#0a0f1e]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-[#0d1425] to-[#0a0f1e]" />

      <div className="container relative mx-auto px-6">
        <div className="mx-auto max-w-3xl text-center space-y-6 mb-16">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl text-white">
            What is{" "}
            <span className="bg-gradient-to-r from-[#0b4a8f] to-[#0b4a8f] bg-clip-text text-transparent">
              Mitra
            </span>
            <span className="bg-gradient-to-r from-[#00c7c7] to-[#00c7c7] bg-clip-text text-transparent">chain</span>
            ?
          </h2>
          <p className="text-lg text-gray-400 text-pretty leading-relaxed">
            A revolutionary blockchain-based membership platform that bridges the gap between small businesses (UMKM)
            and customers, creating transparent, secure, and rewarding relationships powered by Cardano.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="group relative rounded-xl border border-[#003366]/30 bg-[#0d1425]/50 p-8 backdrop-blur-sm transition-all hover:border-[#00BCD4]/50 hover:shadow-lg hover:shadow-[#00BCD4]/10">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#003366] to-[#0288D1]">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">Blockchain Security</h3>
            <p className="text-gray-400 leading-relaxed">
              Built on Cardano's secure and sustainable blockchain infrastructure, ensuring every transaction is
              transparent and immutable.
            </p>
          </div>

          <div className="group relative rounded-xl border border-[#003366]/30 bg-[#0d1425]/50 p-8 backdrop-blur-sm transition-all hover:border-[#00BCD4]/50 hover:shadow-lg hover:shadow-[#00BCD4]/10">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#003366] to-[#0288D1]">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">Instant Rewards</h3>
            <p className="text-gray-400 leading-relaxed">
              Real-time membership benefits and loyalty rewards that are automatically processed through smart
              contracts.
            </p>
          </div>

          <div className="group relative rounded-xl border border-[#003366]/30 bg-[#0d1425]/50 p-8 backdrop-blur-sm transition-all hover:border-[#00BCD4]/50 hover:shadow-lg hover:shadow-[#00BCD4]/10">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#003366] to-[#0288D1]">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">Community Driven</h3>
            <p className="text-gray-400 leading-relaxed">
              Empowering local UMKM businesses to build lasting relationships with their customers through digital
              memberships.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
