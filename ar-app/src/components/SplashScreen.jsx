import { useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'
import { LOGO_URL } from '../config'

const YELLOW = '#EAB308'

function SplashBg() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', width: 340, height: 340, borderRadius: '50%',
        top: -100, left: -80,
        background: 'radial-gradient(circle, rgba(234,179,8,0.09) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute', width: 260, height: 260, borderRadius: '50%',
        bottom: 100, right: -60,
        background: 'radial-gradient(circle, rgba(234,179,8,0.07) 0%, transparent 70%)',
      }} />
      <svg style={{ position: 'absolute', inset: 0, opacity: 0.035 }} width="390" height="844">
        {Array.from({ length: 30 }, (_, i) => (
          <line key={i} x1={i * 28 - 100} y1="0" x2={i * 28 + 500} y2="844"
            stroke="#EAB308" strokeWidth="0.8" />
        ))}
      </svg>
    </div>
  )
}

function LangButton({ label, sub, onClick }) {
  return (
    <button
      className="lang-btn"
      onClick={onClick}
      style={{
        width: '100%', padding: '17px 22px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        border: 'none',
        fontFamily: "'Noto Sans TC', 'Space Grotesk', sans-serif",
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', letterSpacing: '0.03em' }}>{label}</span>
        <span style={{ fontSize: 10.5, color: 'rgba(234,179,8,0.75)', marginTop: 2, letterSpacing: '0.09em' }}>{sub}</span>
      </div>
      <div style={{
        width: 34, height: 34, borderRadius: '50%',
        background: 'rgba(234,179,8,0.1)',
        border: '1px solid rgba(234,179,8,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <ChevronRight size={14} color={YELLOW} strokeWidth={2.5} />
      </div>
    </button>
  )
}

export default function SplashScreen({ onSelectLang }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 1400)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#FFFFFF',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.6s ease',
    }}>
      <SplashBg />

      {/* Logo zone */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        paddingTop: 80,
        animation: 'softFloat 4s ease-in-out infinite',
      }}>
        <div style={{ animation: 'breathe 3.8s ease-in-out infinite, glowPulse 3.8s ease-in-out infinite' }}>
          <img
            src={LOGO_URL}
            alt="陽光沒有照亮的那一半"
            style={{ width: 260, objectFit: 'contain' }}
          />
        </div>
        <div style={{
          marginTop: 18, fontSize: 9.5, letterSpacing: '0.26em',
          color: 'rgba(234,179,8,0.55)',
          fontFamily: "'Space Grotesk', sans-serif",
          textTransform: 'uppercase',
          animation: 'fadeIn 1.2s ease 0.6s both',
        }}>
          AR Interactive Experience
        </div>
      </div>

      {/* CTA buttons */}
      <div style={{
        width: '100%', padding: '0 36px 72px',
        display: 'flex', flexDirection: 'column', gap: 13,
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 1 ? 'translateY(0)' : 'translateY(18px)',
        transition: 'all 0.55s cubic-bezier(0.22,1,0.36,1)',
      }}>
        <LangButton label="中文" sub="Chinese" onClick={() => onSelectLang('zh')} />
        <LangButton label="English" sub="英語" onClick={() => onSelectLang('en')} />

        <div style={{
          textAlign: 'center', marginTop: 10,
          fontSize: 9.5, letterSpacing: '0.13em',
          color: 'rgba(0,0,0,0.22)',
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          Powered by IN THE OTHER SIDE OF THE MOON
        </div>
      </div>
    </div>
  )
}
