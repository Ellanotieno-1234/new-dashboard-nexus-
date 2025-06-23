import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import { ThemeProviderWrapper } from '@/components/providers/ThemeProviderWrapper'
import { LanguageProvider } from '@/lib/i18n/LanguageContext'
import './globals.css'

// Loading components
function ChartLoader() {
  return <div className="w-full h-64 animate-pulse bg-slate-800/50 rounded-lg"></div>
}

function TableLoader() {
  return <div className="w-full h-96 animate-pulse bg-slate-800/50 rounded-lg"></div>
}

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kenya Airways Nexus - Aviation Parts Management',
  description: 'Advanced aviation parts management and tracking system for Kenya Airways',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${inter.className} antialiased transition-colors duration-200`}>
        <ThemeProviderWrapper>
          <LanguageProvider>
            <Suspense fallback={
              <div className="container mx-auto p-4 space-y-4">
                <ChartLoader />
                <TableLoader />
              </div>
            }>
              {children}
            </Suspense>
          </LanguageProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  )
}
