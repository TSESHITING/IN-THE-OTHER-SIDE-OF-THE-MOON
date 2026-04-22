import { useState, useEffect } from 'react'
import SplashScreen from './components/SplashScreen'
import ScannerScreen from './components/ScannerScreen'
import VideoModal from './components/VideoModal'
import TransitionOverlay from './components/TransitionOverlay'
import { QR_NODES } from './data/nodes'

function App() {
  const [screen, setScreen] = useState('splash')
  const [lang, setLang] = useState(() => localStorage.getItem('ar_lang') || 'zh')
  const [transitioning, setTransitioning] = useState(false)
  const [activeNode, setActiveNode] = useState(null)

  // Dev hook: trigger a scan from the console while Mind-AR integration is pending.
  // Example: __scan(1) opens Node 1's video modal.
  useEffect(() => {
    window.__scan = (id = 1) => {
      const node = QR_NODES.find(n => n.id === id)
      if (node) setActiveNode(node)
      else console.warn(`[AR] node ${id} not found`)
    }
    return () => { delete window.__scan }
  }, [])

  const selectLang = (l) => {
    localStorage.setItem('ar_lang', l)
    setLang(l)
    setTransitioning(true)
    setTimeout(() => { setScreen('scanner'); setTransitioning(false) }, 520)
  }

  const toggleLang = () => {
    const next = lang === 'zh' ? 'en' : 'zh'
    localStorage.setItem('ar_lang', next)
    setLang(next)
  }

  return (
    <div style={{
      position: 'relative', width: 390, height: 844,
      overflow: 'hidden', background: '#fff',
      fontFamily: "'Noto Sans TC', 'Space Grotesk', sans-serif",
    }}>
      {screen === 'splash' && <SplashScreen onSelectLang={selectLang} />}
      {screen === 'scanner' && (
        <ScannerScreen
          lang={lang}
          onToggleLang={toggleLang}
          onScanNode={setActiveNode}
          onGoHome={() => setScreen('splash')}
        />
      )}
      {activeNode && (
        <VideoModal node={activeNode} lang={lang} onClose={() => setActiveNode(null)} />
      )}
      <TransitionOverlay active={transitioning} />
    </div>
  )
}

export default App
