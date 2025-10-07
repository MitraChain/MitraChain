// apps/fe-mitra/src/features/transactions/components/scan-qr-dialog.tsx
'use client'

import { Button } from '@workspace/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'
import { Label } from '@workspace/ui/components/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import { Textarea } from '@workspace/ui/components/textarea'
import jsQR from 'jsqr' // Import jsQR
import { Camera, Loader2, QrCode, Type } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useScanMember } from '../api/scan-member'

interface ScanQRDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMemberScanned: (membership: any) => void
}

export function ScanQRDialog({ open, onOpenChange, onMemberScanned }: ScanQRDialogProps) {
  const [qrData, setQrData] = useState('')
  const [activeTab, setActiveTab] = useState<'camera' | 'manual'>('camera')
  const [isCameraReady, setIsCameraReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isScanning = useRef(false) // Prevent multiple scans

  const scanMutation = useScanMember({
    mutationConfig: {
      onSuccess: (data) => {
        onMemberScanned(data.membership)
        stopCamera()
        onOpenChange(false)
        setQrData('')
      },
    },
  })

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 640, height: 480 },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsCameraReady(true)

        // Wait for video to be ready before scanning
        videoRef.current.onloadedmetadata = () => {
          startScanning()
        }
      }
    } catch (error) {
      console.error('Camera access error:', error)
      alert('Unable to access camera. Please use manual input.')
      setActiveTab('manual')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }
    setIsCameraReady(false)
    isScanning.current = false
  }

  const startScanning = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    const scan = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA && !isScanning.current) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

        // Decode QR dengan jsQR
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        })

        if (code && code.data) {
          console.log('QR Code detected:', code.data)
          isScanning.current = true
          scanMutation.mutate(code.data)
          stopCamera()
        }
      }
    }

    // Scan continuously using requestAnimationFrame (lebih smooth dari setInterval)
    const scanLoop = () => {
      scan()
      if (streamRef.current) {
        requestAnimationFrame(scanLoop)
      }
    }

    scanLoop()
  }

  useEffect(() => {
    if (open && activeTab === 'camera') {
      startCamera()
    }

    return () => {
      stopCamera()
    }
  }, [open, activeTab])

  const handleManualScan = () => {
    if (!qrData.trim()) return
    scanMutation.mutate(qrData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Scan Member QR
          </DialogTitle>
          <DialogDescription>
            Scan with camera or paste QR data from customer's MitraChain app
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="camera" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Camera
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Manual
            </TabsTrigger>
          </TabsList>

          <TabsContent value="camera" className="space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {!isCameraReady && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}

              {/* Scanning indicator */}
              {isCameraReady && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-64 w-64 rounded-lg border-2 border-white">
                    <div className="absolute left-0 top-0 h-8 w-8 rounded-tl-lg border-l-4 border-t-4 border-green-500" />
                    <div className="absolute right-0 top-0 h-8 w-8 rounded-tr-lg border-r-4 border-t-4 border-green-500" />
                    <div className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-lg border-b-4 border-l-4 border-green-500" />
                    <div className="absolute bottom-0 right-0 h-8 w-8 rounded-br-lg border-b-4 border-r-4 border-green-500" />
                  </div>
                </div>
              )}
            </div>
            <p className="text-muted-foreground text-center text-sm">
              Position QR code within the frame
            </p>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qr-data">QR Data</Label>
              <Textarea
                id="qr-data"
                placeholder="Paste QR data here..."
                value={qrData}
                onChange={(e) => setQrData(e.target.value)}
                rows={6}
                disabled={scanMutation.isPending}
                className="font-mono text-xs"
              />
            </div>

            <Button
              onClick={handleManualScan}
              disabled={scanMutation.isPending || !qrData.trim()}
              className="w-full"
            >
              {scanMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Scan & Continue'
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
