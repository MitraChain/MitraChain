import { Hexagon } from "lucide-react"

const features = [
  {
    title: "Digital Membership Cards",
    description: "Secure, blockchain-verified membership cards stored in your digital wallet",
  },
  {
    title: "Smart Contract Automation",
    description: "Automated reward distribution and membership benefits through Cardano smart contracts",
  },
  {
    title: "Transparent Transactions",
    description: "Every transaction recorded on-chain for complete transparency and trust",
  },
  {
    title: "Multi-Business Support",
    description: "Single membership platform connecting you with hundreds of local UMKM partners",
  },
  {
    title: "Real-Time Analytics",
    description: "Businesses get instant insights into customer engagement and loyalty metrics",
  },
  {
    title: "Decentralized Identity",
    description: "Your membership data is owned by you, secured by blockchain technology",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 overflow-hidden bg-[#0a0f1e]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-[#0a0f1e] to-[#0d1425]" />
        <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-[#0288D1]/5 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-6">
        <div className="mx-auto max-w-3xl text-center space-y-6 mb-16">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl text-white">
            Powerful{" "}
            <span className="bg-gradient-to-r from-[#0288D1] via-20% to-[#00c7c7] bg-clip-text text-transparent">Features</span>
          </h2>
          <p className="text-lg text-gray-400 text-pretty leading-relaxed">
            Everything you need to build trust, loyalty, and lasting relationships between businesses and customers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-xl border border-white/10 bg-[#0d1425]/30 p-6 backdrop-blur-sm transition-all hover:border-[#00BCD4]/50 hover:bg-[#0d1425]/50"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#003366]/30 bg-[#003366]/20">
                <Hexagon className="h-5 w-5 text-[#00BCD4]" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
