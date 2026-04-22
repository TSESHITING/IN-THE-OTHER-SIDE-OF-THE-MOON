const YELLOW = '#EAB308'
const ARM = 28

const CORNERS = [
  { pos: { top: 0, left: 0 },    d: `M ${ARM} 0 L 0 0 L 0 ${ARM}` },
  { pos: { top: 0, right: 0 },   d: `M 0 0 L ${ARM} 0 L ${ARM} ${ARM}` },
  { pos: { bottom: 0, right: 0 }, d: `M ${ARM} ${ARM} L ${ARM} 0 M ${ARM} ${ARM} L 0 ${ARM}` },
  { pos: { bottom: 0, left: 0 }, d: `M 0 ${ARM} L 0 0 M 0 ${ARM} L ${ARM} ${ARM}` },
]

export default function Reticle({ scanning }) {
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      animation: scanning ? 'none' : 'reticleBreathe 2.8s ease-in-out infinite',
    }}>
      {/* Outer frame (dim) */}
      <div style={{
        position: 'absolute', inset: 0,
        border: '1px solid rgba(234,179,8,0.14)',
        borderRadius: 6,
      }} />

      {/* Yellow corner brackets */}
      {CORNERS.map(({ pos, d }, i) => (
        <svg
          key={i}
          width={ARM} height={ARM}
          viewBox={`0 0 ${ARM} ${ARM}`}
          style={{
            position: 'absolute', ...pos,
            overflow: 'visible',
            animation: `cornerBreathe ${2.2 + i * 0.18}s ease-in-out infinite`,
          }}
        >
          <path d={d} fill="none" stroke={YELLOW} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ))}

      {/* Scanning line */}
      {scanning && (
        <div style={{
          position: 'absolute', left: 4, right: 4, top: 4, bottom: 4,
          borderRadius: 4, overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, transparent 0%, ${YELLOW} 50%, transparent 100%)`,
            boxShadow: `0 0 10px 2px rgba(234,179,8,0.4)`,
            animation: 'scanLine 1.9s linear forwards',
          }} />
        </div>
      )}

      {/* Center crosshair */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <line x1="7" y1="0" x2="7" y2="5" stroke={YELLOW} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          <line x1="7" y1="9" x2="7" y2="14" stroke={YELLOW} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          <line x1="0" y1="7" x2="5" y2="7" stroke={YELLOW} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          <line x1="9" y1="7" x2="14" y2="7" stroke={YELLOW} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          <circle cx="7" cy="7" r="2" fill={scanning ? YELLOW : 'rgba(234,179,8,0.45)'} />
        </svg>
      </div>

      {/* Pulse rings on scan */}
      {scanning && [0, 1, 2].map(n => (
        <div key={n} style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 10, height: 10, borderRadius: '50%',
          border: `1.5px solid ${YELLOW}`,
          animation: 'ripple 1.6s ease-out infinite',
          animationDelay: `${n * 0.45}s`,
          opacity: 0,
        }} />
      ))}
    </div>
  )
}
