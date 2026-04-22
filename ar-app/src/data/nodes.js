import { nodeAsset } from '../config'

// 11 QR nodes × 2 languages = 22 video assets
//
// Each node carries:
//   - targetImage: AR marker image used by Mind-AR for recognition
//   - zh / en: localized video metadata (title, subtitle, src, duration)
//
// Replace empty `src` / `targetImage` values as real assets become available.
// Duration is in seconds — update to match each video's real length.
export const QR_NODES = [
  {
    id: 1,
    targetImage: nodeAsset('Target_1.png'),
    zh: {
      title: '導覽影片 1',
      subtitle: '中文版',
      src: nodeAsset('Video_1_ZH.mp4'),
      duration: 90,
    },
    en: {
      title: 'Guide Video 1',
      subtitle: 'English',
      src: nodeAsset('Video_1_EN.mp4'),
      duration: 85,
    },
  },
  // Nodes 2–11: placeholder data, ready to be filled when assets arrive
  ...Array.from({ length: 10 }, (_, i) => {
    const id = i + 2
    return {
      id,
      targetImage: '',
      zh: {
        title: `導覽影片 ${id}`,
        subtitle: '中文版',
        src: '',
        duration: 90 + (id - 1) * 8,
      },
      en: {
        title: `Guide Video ${id}`,
        subtitle: 'English',
        src: '',
        duration: 85 + (id - 1) * 7,
      },
    }
  }),
]
