import { cn } from "@workspace/ui/lib/utils"
import Image from "next/image"

interface MitrachainLogoProps {
  className?: string
  showText?: boolean
}

export function MitrachainLogo({ className, showText = false }: MitrachainLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src="/mitrachain-logo.png"
        alt="Mitrachain Logo"
        width={120}
        height={120}
        className="h-full w-auto"
        priority
      />
      {showText && (
        <span className="text-xl font-bold tracking-tight">
          <span style={{ color: "#0b4a8f" }}>Mitra</span>
          <span style={{ color: "#00c7c7" }}>chain</span>
        </span>
      )}
    </div>
  )
}
