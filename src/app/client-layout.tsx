'use client';

import { Suspense } from 'react'
import { ThemeProviderWrapper } from '@/components/providers/ThemeProviderWrapper'
import { LanguageProvider } from '@/lib/i18n/LanguageContext'

// Loading components
function ChartLoader() {
  return <div className="w-full h-64 animate-pulse bg-slate-800/50 rounded-lg"></div>
}

function TableLoader() {
  return <div className="w-full h-96 animate-pulse bg-slate-800/50 rounded-lg"></div>
}

export function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
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
  )
}
