// apps/fe-mitra/app/api/cron/trigger-batch/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/cron/record-batches`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
        'Content-Type': 'application/json',
      },
      keepalive: true,
    })

    return NextResponse.json({ success: true, message: 'Batch recording triggered in background' })
  } catch (error: any) {
    console.error('Trigger error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
