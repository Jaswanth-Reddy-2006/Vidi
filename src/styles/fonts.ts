import { Playfair_Display, Inter } from 'next/font/google';

export const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});
