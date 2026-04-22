import { nodeAsset } from '../config'

// QR code values → node mapping
// QR_A = Node 1, QR_B = Node 2, ... QR_K = Node 11
const QR_CODES = ['QR_A','QR_B','QR_C','QR_D','QR_E','QR_F','QR_G','QR_H','QR_I','QR_J','QR_K']

export const QR_NODES = [
  {
    id: 1,
    qrCode: 'QR_A',
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
  ...Array.from({ length: 10 }, (_, i) => {
    const id = i + 2
    return {
      id,
      qrCode: QR_CODES[id - 1],
      targetImage: '',
      zh: { title: `導覽影片 ${id}`, subtitle: '中文版', src: '', duration: 90 + (id - 1) * 8 },
      en: { title: `Guide Video ${id}`, subtitle: 'English', src: '', duration: 85 + (id - 1) * 7 },
    }
  }),
]
