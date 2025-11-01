import { Sarabun } from 'next/font/google';
import localFont from 'next/font/local';

export const sarabun = Sarabun({ 
  subsets: ['latin'], 
  variable: '--font-sarabun',
  display: 'swap',
  weight: ['400', '700'],
  preload: true
});

export const hvmuse = localFont({
  src: [
    { path: '../../public/fonts/hvmuse/HV Muse.otf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/hvmuse/HV Muse Italic.otf', weight: '400', style: 'italic' },
  ],
  variable: '--font-hvmuse',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif']
});
