import { MitrachainLogo } from '@/features/landing-page/components/mitrachain-logo'
import { Github, Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-border/50 from-background to-card relative overflow-hidden border-t bg-gradient-to-b">
      <div className="absolute inset-0 opacity-20">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="skylineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.65 0.18 195)" stopOpacity="0" />
              <stop offset="100%" stopColor="oklch(0.65 0.18 195)" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container relative mx-auto px-6 py-12 md:py-16">
        <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-6">
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-3">
              <MitrachainLogo className="h-10 w-10" />
              <span className="glow-cyan text-xl font-bold">Mitrachain</span>
            </div>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
              Empowering UMKM businesses with blockchain-based memberships on Cardano. Building
              trust, transparency, and community.
            </p>
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <svg className="text-primary h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="6" r="1.5" />
                <circle cx="12" cy="18" r="1.5" />
                <circle cx="6" cy="9" r="1.5" />
                <circle cx="18" cy="9" r="1.5" />
                <circle cx="6" cy="15" r="1.5" />
                <circle cx="18" cy="15" r="1.5" />
              </svg>
              <span>Powered by Cardano</span>
            </div>
          </div>
        </div>

        <div className="border-border/50 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-muted-foreground text-sm">
            © 2025 Mitrachain. All rights reserved. Built with ❤️ for UMKM.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="border-border bg-card/50 text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg border transition-all"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="border-border bg-card/50 text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg border transition-all"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
