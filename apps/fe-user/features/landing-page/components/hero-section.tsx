'use client'

import { Button } from '@workspace/ui/components/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-[#0a0f1e]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-[#0d1425]/40 to-[#0a0f1e]" />
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="hexagons"
                x="0"
                y="0"
                width="100"
                height="87"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M50 0 L93.3 25 L93.3 62 L50 87 L6.7 62 L6.7 25 Z"
                  fill="none"
                  stroke="#00c7c7"
                  strokeWidth="0.5"
                  opacity="0.14"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagons)" />
          </svg>
        </div>
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-[#003366]/5 blur-xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#0b4a8f]/5 blur-xl" />
      </div>

      <div className="container relative mx-auto flex min-h-[calc(100vh-5rem)] items-center px-6 py-20">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <div
              className="inline-flex items-center gap-2 rounded-full border border-[#003366]/50 bg-[#003366]/20 px-4 py-2 text-sm font-medium"
              style={{ color: '#00c7c7' }}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="6" r="1.5" />
                <circle cx="12" cy="18" r="1.5" />
                <circle cx="6" cy="9" r="1.5" />
                <circle cx="18" cy="9" r="1.5" />
                <circle cx="6" cy="15" r="1.5" />
                <circle cx="18" cy="15" r="1.5" />
              </svg>
              Built on Cardano Blockchain
            </div>

            <h1 className="text-balance text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              <span className="text-white">Empowering</span> Small Businesses with{' '}
              <span className="bg-gradient-to-r from-[#00c7c7] via-[#00c7c7] to-[#003366] bg-clip-text text-transparent">
                Blockchain
              </span>
              <div className="bg-gradient-to-r from-[#0b4a8f] via-[#00c7c7] to-[#00c7c7] bg-clip-text text-transparent">
                Memberships
              </div>
            </h1>

            <p className="max-w-xl text-pretty text-lg leading-relaxed text-gray-400">
              Mitrachain connects UMKM with customers through secure, transparent digital
              memberships powered by Cardano blockchain technology. Experience the future of loyalty
              programs.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/auth">
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-[#00c7c7] to-[#0b4a8f] text-white hover:opacity-90"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href={'#about'}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#003366]/50 bg-transparent text-white hover:bg-[#003366]/20"
                >
                  Explore Platform
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold" style={{ color: '#00c7c7' }}>
                  15K+
                </div>
                <div className="text-sm text-gray-500">Members</div>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div>
                <div className="text-3xl font-bold" style={{ color: '#00c7c7' }}>
                  800+
                </div>
                <div className="text-sm text-gray-500">UMKM Partners</div>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div>
                <div className="text-3xl font-bold" style={{ color: '#00c7c7' }}>
                  100%
                </div>
                <div className="text-sm text-gray-500">Secure</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#003366]/5 to-[#0b4a8f]/5 blur-xl" />
            <div className="relative">
              <NetworkVisualization />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function NetworkVisualization() {
  return (
    <div className="mb-30 relative mx-auto aspect-square w-full max-w-lg pt-0">
      <svg viewBox="0 0 400 400" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#003366" />
            <stop offset="50%" stopColor="#0b4a8f" />
            <stop offset="100%" stopColor="#00c7c7" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="0.3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g stroke="#00c7c7" strokeWidth="1" opacity="0.16" filter="url(#glow)">
          <line x1="200" y1="200" x2="100" y2="100" />
          <line x1="200" y1="200" x2="300" y2="100" />
          <line x1="200" y1="200" x2="100" y2="300" />
          <line x1="200" y1="200" x2="300" y2="300" />
          <line x1="200" y1="200" x2="200" y2="80" />
          <line x1="200" y1="200" x2="200" y2="320" />
          <line x1="200" y1="200" x2="80" y2="200" />
          <line x1="200" y1="200" x2="320" y2="200" />
        </g>

        <g>
          <circle
            cx="100"
            cy="100"
            r="20"
            fill="url(#nodeGradient)"
            opacity="0.35"
            filter="url(#glow)"
          />
          <circle
            cx="300"
            cy="100"
            r="20"
            fill="url(#nodeGradient)"
            opacity="0.35"
            filter="url(#glow)"
          />
          <circle
            cx="100"
            cy="300"
            r="20"
            fill="url(#nodeGradient)"
            opacity="0.35"
            filter="url(#glow)"
          />
          <circle
            cx="300"
            cy="300"
            r="20"
            fill="url(#nodeGradient)"
            opacity="0.35"
            filter="url(#glow)"
          />
          <circle
            cx="200"
            cy="80"
            r="18"
            fill="url(#nodeGradient)"
            opacity="0.35"
            filter="url(#glow)"
          />
          <circle
            cx="200"
            cy="320"
            r="18"
            fill="url(#nodeGradient)"
            opacity="0.35"
            filter="url(#glow)"
          />
          <circle
            cx="80"
            cy="200"
            r="18"
            fill="url(#nodeGradient)"
            opacity="0.35"
            filter="url(#glow)"
          />
          <circle
            cx="320"
            cy="200"
            r="18"
            fill="url(#nodeGradient)"
            opacity="0.35"
            filter="url(#glow)"
          />
        </g>

        <g>
          <circle
            cx="200"
            cy="200"
            r="40"
            fill="url(#nodeGradient)"
            opacity="0.10"
            filter="url(#glow)"
          />
          <circle
            cx="200"
            cy="200"
            r="30"
            fill="url(#nodeGradient)"
            opacity="0.22"
            filter="url(#glow)"
          />
          <circle
            cx="200"
            cy="200"
            r="20"
            fill="url(#nodeGradient)"
            opacity="0.9"
            filter="url(#glow)"
          />
        </g>

        {/* Cardano symbols on outer nodes */}
        <g fill="white" fontSize="12" textAnchor="middle">
          <text x="100" y="105">
            ₳
          </text>
          <text x="300" y="105">
            ₳
          </text>
          <text x="100" y="305">
            ₳
          </text>
          <text x="300" y="305">
            ₳
          </text>
        </g>
      </svg>
    </div>
  )
}
