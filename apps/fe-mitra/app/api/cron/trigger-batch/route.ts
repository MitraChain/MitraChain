// apps/fe-mitra/app/api/cron/trigger-batch/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/cron/record-batches`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
