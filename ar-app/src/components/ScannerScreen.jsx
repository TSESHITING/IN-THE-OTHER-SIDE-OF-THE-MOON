import { useState } from 'react'
import { Globe, ArrowLeftRight, Home } from 'lucide-react'
import Reticle from './Reticle'
import { LOGO_URL } from '../config'

const YELLOW = '#EAB308'

export default function ScannerScreen({ lang, onToggleLang, onScanNode, onGoHome }) {
  const [scanning, setScanning] = useState(false)

  // Called externally (e.g. by Mind-AR targetFound) to trigger a scan result
  // For the prototype, there's no manual trigger — real integration replaces this
  const startScan = (node) => {
    if (scanning) return
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      onScanNode(node)
    }, 1900)
  }

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#FFFFFF', animation: 'fadeIn 0.4s ease' }}>

      {/* Camera simulation background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse at 50% 38%, rgba(234,179,8,0.06) 0%, transparent 55%),
          linear-gradient(180deg, #fafafa 0%, #f5f5f0 100%)
        `,
      }}>
        <svg style={{ position: 'absolute', inset: 0, opacity: 0.04 }} width="390" height="844">
          {Array.from({ length: 18 }, (_, i) => (
            <line key={`v${i}`} x1={i * 24} y1="0" x2={i * 24} y2="844" stroke="#888" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 38 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 24} x2="390" y2={i * 24} stroke="#888" strokeWidth="0.5" />
          ))}
        </svg>
      </div>

      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
        padding: '50px 18px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.92) 60%, transparent 100%)',
        backdropFilter: 'blur(6px)',
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
            padding: '7px 13px',
            display: 'flex', alignItems: 'center', gap: 7,
            border: 'none', fontSize: 12, fontWeight: 600,
            fontFamily: "'Space Grotesk', 'Noto Sans TC', sans-serif",
          }}
        >
          <Globe size={13} color={YELLOW} strokeWidth={2} />
          <span style={{ color: YELLOW }}>{lang === 'zh' ? '中文' : 'EN'}</span>
          <ArrowLeftRight size={11} color="rgba(0,0,0,0.3)" strokeWidth={2.2} />
        </button>
      </div>

      {/* Reticle */}
      <div style={{
        position: 'absolute', top: 128, left: '50%',
        transform: 'translateX(-50%)',
        width: 232, height: 232,
      }}>
        <Reticle scanning={scanning} />
        <div style={{
          position: 'absolute', top: '100%', marginTop: 22,
          width: '100%', textAlign: 'center',
          color: scanning ? YELLOW : 'rgba(0,0,0,0.38)',
          fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase',
          fontFamily: "'Space Grotesk', sans-serif",
          transition: 'color 0.3s',
          whiteSpace: 'nowrap',
        }}>
          {scanning
            ? (lang === 'zh' ? '辨識中…' : 'Scanning…')
            : (lang === 'zh' ? '對準展品掃描點' : 'Aim at exhibit marker')}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(0deg, rgba(255,255,255,0.96) 70%, transparent 100%)',
        backdropFilter: 'blur(14px)',
        padding: '20px 24px 38px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
      }}>
        {/* Home button */}
        <button
          onClick={onGoHome}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '11px 22px', borderRadius: 12,
            background: 'rgba(255,255,255,0.85)',
            border: '1.5px solid rgba(234,179,8,0.32)',
            cursor: 'pointer', transition: 'all 0.25s',
            fontFamily: "'Space Grotesk', 'Noto Sans TC', sans-serif",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = YELLOW
            e.currentTarget.style.boxShadow = '0 2px 14px rgba(234,179,8,0.2)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(234,179,8,0.32)'
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <Home size={15} color={YELLOW} strokeWidth={2.2} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', letterSpacing: '0.04em' }}>
            {lang === 'zh' ? '返回首頁' : 'Home'}
          </span>
        </button>

        {/* Brand footer */}
        <div style={{
          fontSize: 9, letterSpacing: '0.13em',
          color: 'rgba(0,0,0,0.18)',
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          Powered by IN THE OTHER SIDE OF THE MOON
        </div>
      </div>
    </div>
  )
}
