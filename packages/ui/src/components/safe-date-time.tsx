'use client'

import { formatWIBTimeDate } from '@workspace/lib/index.ts'
import { useEffect, useState } from 'react'

interface SafeDateTimeProps {
  date: string | undefined
}

export function SafeDateTime({ date }: SafeDateTimeProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!date) {
    return <span>-</span>
  }

  return <span>{isClient ? formatWIBTimeDate(date) : ''}</span>
}
