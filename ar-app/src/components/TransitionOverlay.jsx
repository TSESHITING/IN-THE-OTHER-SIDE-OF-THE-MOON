const YELLOW = '#EAB308'

export default function TransitionOverlay({ active }) {
  if (!active) return null
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200,
      background: 'rgba(255,255,255,0.92)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.2s ease',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        border: `2px solid rgba(234,179,8,0.25)`,
        borderTopColor: YELLOW,
        animation: 'spin 0.75s linear infinite',
      }} />
    </div>
  )
}
