// Brand + shared asset URLs
// Centralized so they can be swapped in one place when real assets are ready.
const GITHUB_RAW = 'https://github.com/TSESHITING/IN-THE-OTHER-SIDE-OF-THE-MOON/raw/refs/heads/main'

export const LOGO_URL = `${GITHUB_RAW}/Logo.PNG`

// Helper for node assets so future nodes can follow the same naming convention
export const nodeAsset = (filename) => `${GITHUB_RAW}/${filename}`
