import { AboutSection } from '@/features/landing-page/components/about-section'
import { CTASection } from '@/features/landing-page/components/cta-section'
import { FeaturesSection } from '@/features/landing-page/components/features-section'
import { Footer } from '@/features/landing-page/components/footer'
import { HeroSection } from '@/features/landing-page/components/hero-section'
import { Navbar } from '@/features/landing-page/components/navbar'
import { PartnersSection } from '@/features/landing-page/components/partners-section'

export default function LandingPage() {
  return (
    <main className="from-background via-background to-card min-h-screen bg-gradient-to-b">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <PartnersSection />
      <CTASection />
      <Footer />
    </main>
  )
}
