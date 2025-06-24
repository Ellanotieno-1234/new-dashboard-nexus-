import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientLayout } from './client-layout'

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
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
