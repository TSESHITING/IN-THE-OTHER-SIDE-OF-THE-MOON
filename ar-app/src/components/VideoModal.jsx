import { useState, useEffect, useRef } from 'react'
import { SkipBack, Play, Pause, X } from 'lucide-react'

const YELLOW = '#EAB308'

function fmt(s) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

function CtrlBtn({ onClick, children }) {
  return (
    <button onClick={onClick} className="ctrl-btn">
      {children}
    </button>
  )
}

export default function VideoModal({ node, lang, onClose }) {
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef(null)
  const simTimerRef = useRef(null)

  const meta = lang === 'zh' ? node.zh : node.en
  const hasRealVideo = Boolean(meta.src)

  // Initial duration comes from metadata; updated by <video> once loaded
  useEffect(() => {
    setDuration(meta.duration)
    setElapsed(0)
  }, [meta.src, meta.duration])

  // Autoplay after modal entrance animation
  useEffect(() => {
    const t = setTimeout(() => setPlaying(true), 350)
    return () => clearTimeout(t)
  }, [])

  // Real <video> playback control
  useEffect(() => {
    if (!hasRealVideo) return
    const el = videoRef.current
    if (!el) return
    if (playing) el.play().catch(() => setPlaying(false))
    else el.pause()
  }, [playing, hasRealVideo])

  // Placeholder fallback: simulate progress with a timer when no real video src
  useEffect(() => {
    if (hasRealVideo) return
    if (playing) {
      simTimerRef.current = setInterval(() => {
        setElapsed(e => {
          const next = e + 0.5
          if (next >= duration) {
            setPlaying(false)
            clearInterval(simTimerRef.current)
            return duration
          }
          return next
        })
      }, 500)
    } else {
      clearInterval(simTimerRef.current)
    }
    return () => clearInterval(simTimerRef.current)
  }, [playing, duration, hasRealVideo])

  const progress = duration > 0 ? (elapsed / duration) * 100 : 0

  const handleRewind = () => {
    setElapsed(0)
    setPlaying(false)
    if (videoRef.current) videoRef.current.currentTime = 0
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      background: 'rgba(255,255,255,0.55)',
      backdropFilter: 'blur(10px)',
      animation: 'fadeIn 0.25s ease',
    }}>
      <div style={{ flex: 1 }} onClick={onClose} />

      <div className="glass-white" style={{
        margin: '0 14px 30px',
        padding: '22px 20px 20px',
        border: '1px solid rgba(234,179,8,0.28)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,0.9) inset',
        animation: 'slideUp 0.4s cubic-bezier(0.22,1,0.36,1)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
          <div>
            <div style={{
              fontSize: 9.5, color: YELLOW, letterSpacing: '0.18em',
              textTransform: 'uppercase', marginBottom: 5,
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              {lang === 'zh' ? '導覽影片' : 'Guide Video'} · {node.id.toString().padStart(2, '0')}
            </div>
            <div style={{
              fontSize: 15.5, fontWeight: 700, color: '#111', lineHeight: 1.35,
              fontFamily: "'Noto Sans TC', 'Space Grotesk', sans-serif",
            }}>
              {meta.title}
            </div>
            <div style={{
              fontSize: 11, color: 'rgba(0,0,0,0.4)', marginTop: 3,
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              {meta.subtitle}
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 34, height: 34, borderRadius: '50%', flexShrink: 0, marginLeft: 10,
            background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
            <X size={13} color="rgba(0,0,0,0.55)" strokeWidth={2.5} />
          </button>
        </div>

        {/* Video surface */}
        <div style={{
          width: '100%', height: 180, borderRadius: 12,
          background: '#000',
          border: '1px solid rgba(234,179,8,0.15)',
          marginBottom: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          {hasRealVideo ? (
            <video
              ref={videoRef}
              src={meta.src}
              playsInline
              preload="metadata"
              onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
              onTimeUpdate={e => setElapsed(e.currentTarget.currentTime)}
              onEnded={() => setPlaying(false)}
              style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
            />
          ) : (
            <>
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.96)' }} />
              <div style={{
                position: 'absolute', inset: 0, opacity: 0.06,
                background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(234,179,8,0.5) 10px, rgba(234,179,8,0.5) 11px)',
              }} />
              <div style={{ textAlign: 'center', zIndex: 1, padding: '0 16px' }}>
                {playing ? (
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    border: `2px solid ${YELLOW}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'scannerPulse 1.1s ease-in-out infinite',
                    margin: '0 auto 8px',
                  }}>
                    <Pause size={14} fill={YELLOW} color={YELLOW} />
                  </div>
                ) : progress >= 100 ? (
                  <div style={{ fontSize: 20, marginBottom: 8 }}>✓</div>
                ) : (
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'rgba(234,179,8,0.1)', border: `1.5px solid rgba(234,179,8,0.4)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 8px',
                  }}>
                    <Play size={14} fill={YELLOW} color={YELLOW} />
                  </div>
                )}
                <div style={{
                  fontSize: 9, color: 'rgba(0,0,0,0.35)',
                  fontFamily: "'Space Grotesk', monospace",
                  letterSpacing: '0.04em',
                }}>
                  {lang === 'zh' ? '影片尚未提供' : 'Video not yet available'}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 16 }}>
          <div style={{
            width: '100%', height: 3.5, borderRadius: 2,
            background: 'rgba(0,0,0,0.08)', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: `linear-gradient(90deg, rgba(234,179,8,0.75), ${YELLOW})`,
              borderRadius: 2,
              boxShadow: '0 0 6px rgba(234,179,8,0.45)',
              transition: hasRealVideo ? 'width 0.15s linear' : 'width 0.5s linear',
            }} />
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', marginTop: 5,
            fontSize: 9.5, color: 'rgba(0,0,0,0.35)',
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            <span>{fmt(elapsed)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
          <CtrlBtn onClick={handleRewind}>
            <SkipBack size={14} color="rgba(0,0,0,0.5)" strokeWidth={2.2} />
          </CtrlBtn>

          <button
            onClick={() => setPlaying(p => !p)}
            style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'rgba(234,179,8,0.12)',
              border: `1.5px solid ${YELLOW}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 0 18px rgba(234,179,8,0.25)',
              transition: 'all 0.2s',
            }}
          >
            {playing
              ? <Pause size={15} fill={YELLOW} color={YELLOW} />
              : <Play size={15} fill={YELLOW} color={YELLOW} />
            }
          </button>

          <CtrlBtn onClick={onClose}>
            <X size={14} color="rgba(0,0,0,0.5)" strokeWidth={2.2} />
          </CtrlBtn>
        </div>
      </div>
    </div>
  )
}
