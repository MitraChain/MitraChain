import { AboutSection } from '@/features/landing-page/components/about-section'
import { CTASection } from '@/features/landing-page/components/cta-section'
import { FadeInSection } from '@/features/landing-page/components/fade-in-section'
import { FeaturesSection } from '@/features/landing-page/components/features-section'
import { Footer } from '@/features/landing-page/components/footer'
import { HeroSection } from '@/features/landing-page/components/hero-section'
import { Navbar } from '@/features/landing-page/components/navbar'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white transition-colors duration-700">
      <Navbar />

      <HeroSection />

      <FadeInSection delay={0.2}>
        <AboutSection />
      </FadeInSection>

      <FadeInSection delay={0.3}>
        <FeaturesSection />
      </FadeInSection>

      <FadeInSection delay={0.4}>
        <CTASection />
      </FadeInSection>

      <Footer />
    </main>
  )
}
