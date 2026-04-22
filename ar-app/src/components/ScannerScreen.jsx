import { useState, useEffect, useRef } from 'react'
import { Globe, ArrowLeftRight, Home } from 'lucide-react'
import jsQR from 'jsqr'
import Reticle from './Reticle'
import { LOGO_URL } from '../config'
import { QR_NODES } from '../data/nodes'

const YELLOW = '#EAB308'

export default function ScannerScreen({ lang, onToggleLang, onScanNode, onGoHome }) {
  const [scanning, setScanning] = useState(false)
  const [camError, setCamError] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const rafRef = useRef(null)
  const cooldownRef = useRef(false)
  const scanningRef = useRef(false)

  useEffect(() => {
    let active = true

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        })
        if (!active) { stream.getTracks().forEach(t => t.stop()); return }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        rafRef.current = requestAnimationFrame(tick)
      } catch (err) {
        if (active) setCamError(err.name === 'NotAllowedError' ? 'permission' : 'unavailable')
      }
    }

    const tick = () => {
      if (!active) return
      const video = videoRef.current
      const canvas = canvasRef.current
      if (video && canvas && video.readyState === 4) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        ctx.drawImage(video, 0, 0)
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(img.data, img.width, img.height)
        if (code && !cooldownRef.current && !scanningRef.current) {
          const node = QR_NODES.find(n => n.qrCode === code.data)
          if (node) handleDetected(node)
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    startCamera()

    return () => {
      active = false
      cancelAnimationFrame(rafRef.current)
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [])

  const handleDetected = (node) => {
    scanningRef.current = true
    cooldownRef.current = true
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      scanningRef.current = false
      onScanNode(node)
      // 3-second cooldown so the same QR doesn't re-trigger immediately
      setTimeout(() => { cooldownRef.current = false }, 3000)
    }, 1800)
  }

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#000', animation: 'fadeIn 0.4s ease' }}>

      {/* Live camera feed */}
      <video
        ref={videoRef}
        playsInline
        muted
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      {/* Hidden canvas for QR scanning */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Camera error states */}
      {camError && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 12,
          background: 'rgba(255,255,255,0.96)', zIndex: 5, padding: '0 40px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 36 }}>📷</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>
            {camError === 'permission'
              ? (lang === 'zh' ? '需要相機權限' : 'Camera Permission Required')
              : (lang === 'zh' ? '找不到相機' : 'Camera Unavailable')}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', lineHeight: 1.6 }}>
            {camError === 'permission'
              ? (lang === 'zh' ? '請在瀏覽器設定中允許相機存取，然後重新整理頁面。' : 'Please allow camera access in browser settings, then refresh.')
              : (lang === 'zh' ? '請確認裝置有相機，並使用 HTTPS 或 localhost 開啟。' : 'Ensure your device has a camera and the page is served over HTTPS.')}
          </div>
          <button onClick={() => window.location.reload()} style={{
            marginTop: 8, padding: '10px 24px', borderRadius: 10,
            background: YELLOW, border: 'none', fontSize: 13, fontWeight: 600,
            color: '#fff', cursor: 'pointer',
          }}>
            {lang === 'zh' ? '重新整理' : 'Refresh'}
          </button>
        </div>
      )}

      {/* Dark overlay to improve UI readability over camera */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', pointerEvents: 'none' }} />

      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
        padding: '50px 18px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 60%, transparent 100%)',
      }}>
        <img
          src={LOGO_URL}
          alt="logo"
          style={{ height: 26, objectFit: 'contain', animation: 'glowPulse 3s ease-in-out infinite' }}
        />
        <button
          className="glass-pill"
          onClick={onToggleLang}
          style={{
            padding: '7px 13px', display: 'flex', alignItems: 'center', gap: 7,
            border: 'none', fontSize: 12, fontWeight: 600,
            fontFamily: "'Space Grotesk', 'Noto Sans TC', sans-serif",
          }}
        >
          <Globe size={13} color={YELLOW} strokeWidth={2} />
          <span style={{ color: YELLOW }}>{lang === 'zh' ? '中文' : 'EN'}</span>
          <ArrowLeftRight size={11} color="rgba(255,255,255,0.6)" strokeWidth={2.2} />
        </button>
      </div>

      {/* Reticle */}
      <div style={{
        position: 'absolute', top: 128, left: '50%',
        transform: 'translateX(-50%)', width: 232, height: 232,
      }}>
        <Reticle scanning={scanning} />
        <div style={{
          position: 'absolute', top: '100%', marginTop: 22,
          width: '100%', textAlign: 'center',
          color: scanning ? YELLOW : 'rgba(255,255,255,0.75)',
          fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase',
          fontFamily: "'Space Grotesk', sans-serif",
          transition: 'color 0.3s', whiteSpace: 'nowrap',
          textShadow: '0 1px 4px rgba(0,0,0,0.5)',
        }}>
          {scanning
            ? (lang === 'zh' ? '辨識中…' : 'Scanning…')
            : (lang === 'zh' ? '對準 QR Code 掃描' : 'Aim at QR Code')}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 70%, transparent 100%)',
        padding: '20px 24px 38px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
      }}>
        <button
          onClick={onGoHome}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '11px 22px', borderRadius: 12,
            background: 'rgba(255,255,255,0.15)',
            border: '1.5px solid rgba(234,179,8,0.5)',
            cursor: 'pointer', transition: 'all 0.25s',
            fontFamily: "'Space Grotesk', 'Noto Sans TC', sans-serif",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
        >
          <Home size={15} color={YELLOW} strokeWidth={2.2} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', letterSpacing: '0.04em' }}>
            {lang === 'zh' ? '返回首頁' : 'Home'}
          </span>
        </button>
        <div style={{
          fontSize: 9, letterSpacing: '0.13em',
          color: 'rgba(255,255,255,0.35)',
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          Powered by IN THE OTHER SIDE OF THE MOON
        </div>
      </div>
    </div>
  )
}
