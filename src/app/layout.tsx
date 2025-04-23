import './globals.css'
import type { Metadata } from 'next'
import { Providers } from '../components/Providers';
import localFont from 'next/font/local';
import { Inter } from 'next/font/google'
import Footer from '../components/Footer';

// Load Geist font locally
const geistSans = localFont({
  src: [
    {
      path: '../../node_modules/geist/dist/fonts/geist-sans/Geist-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../node_modules/geist/dist/fonts/geist-sans/Geist-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../node_modules/geist/dist/fonts/geist-sans/Geist-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = localFont({
  src: [
    {
      path: '../../node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../node_modules/geist/dist/fonts/geist-mono/GeistMono-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../node_modules/geist/dist/fonts/geist-mono/GeistMono-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-geist-mono',
  display: 'swap',
});

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AP GILA EKO9 Board Game',
  description: 'An educational journey through interactive gameplay - Araling Panlipunan Game-based Interactive Learning Activities for Ekonomiks Grade 9',
  keywords: ['education', 'board game', 'learning', 'economics', 'interactive', 'AP', 'GILA', 'EKO9'],
  authors: [{ name: 'Lance' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#4F46E5" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} min-h-full font-sans antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <Providers>
          <main className="flex min-h-screen flex-col">
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
          </main>
        </Providers>
      </body>
    </html>
  )
}
