'use client'

import { formatWIBTimeDate } from '@workspace/lib/index'
import { useEffect, useState } from 'react'

interface SafeDateTimeProps {
  date: string
}

export function SafeDateTime({ date }: SafeDateTimeProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return <span>{isClient ? formatWIBTimeDate(date) : ''}</span>
}
