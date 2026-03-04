import { PlatformSpec } from './types';

// Supported Gemini Aspect Ratios: "1:1", "3:4", "4:3", "9:16", "16:9"
// Note: "2:3" and "21:9" are mentioned in the prompt feature request, so we include them if the model supports it.

export const PLATFORMS: PlatformSpec[] = [
  {
    id: 'float_pc',
    name: '浮動pc',
    width: 320,
    height: 220,
    ratioLabel: '~1.45:1',
    description: 'PC Floating Banner',
    geminiAspectRatio: '4:3',
  },
  {
    id: 'float_mb',
    name: '浮動mb',
    width: 320,
    height: 100,
    ratioLabel: '3.2:1',
    description: 'Mobile Floating (Highly Compressed)',
    geminiAspectRatio: '16:9', // Closest wide format
  },
  {
    id: 'intext_pc',
    name: '文中pc',
    width: 728,
    height: 110,
    ratioLabel: '6.6:1',
    description: 'In-Article PC (Ultra Wide)',
    geminiAspectRatio: '16:9', // Closest wide format
  },
  {
    id: 'intext_mb',
    name: '文中mb',
    width: 320,
    height: 70,
    ratioLabel: '4.57:1',
    description: 'In-Article Mobile (Ultra Wide)',
    geminiAspectRatio: '16:9',
  },
  {
    id: 'end_article',
    name: '文末（pc+mb）',
    width: 300,
    height: 250,
    ratioLabel: '1.2:1',
    description: 'End of Article (Near Square)',
    geminiAspectRatio: '1:1', // Closest to 1.2:1
  },
  {
    id: 'recommend',
    name: '推薦版位',
    width: 300,
    height: 450,
    ratioLabel: '2:3',
    description: 'Recommendation Vertical',
    geminiAspectRatio: '3:4', // 2:3 is not always standard, 3:4 is safe fallback, but let's try 3:4
  },
  {
    id: 'video_horizontal',
    name: '熟齡閱讀_影音',
    width: 1920,
    height: 1080,
    ratioLabel: '16:9',
    description: 'Video Standard',
    geminiAspectRatio: '16:9',
  },
  {
    id: 'home_pc',
    name: '首頁pc',
    width: 2400,
    height: 960,
    ratioLabel: '2.5:1',
    description: 'Homepage PC Hero',
    geminiAspectRatio: '16:9', // Wide
  },
  {
    id: 'home_mb',
    name: '首頁mb',
    width: 720,
    height: 960,
    ratioLabel: '3:4',
    description: 'Homepage Mobile Full',
    geminiAspectRatio: '3:4',
  },
  {
    id: 'popup_pc',
    name: '蓋板pc',
    width: 970,
    height: 480,
    ratioLabel: '~2:1',
    description: 'PC Popup',
    geminiAspectRatio: '16:9', // Close to 2:1
  },
  {
    id: 'popup_mb',
    name: '蓋板mb',
    width: 320,
    height: 480,
    ratioLabel: '2:3',
    description: 'Mobile Popup',
    geminiAspectRatio: '3:4', // 2:3 approx
  },
  {
    id: 'line_square',
    name: 'line圖文訊息',
    width: 1040,
    height: 1040,
    ratioLabel: '1:1',
    description: 'LINE Perfect Square',
    geminiAspectRatio: '1:1',
  },
];
