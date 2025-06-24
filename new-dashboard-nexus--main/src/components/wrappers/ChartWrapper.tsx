"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Enhanced loading component with skeleton animation
const ChartLoading = () => (
  <div className="w-full h-[300px] rounded-lg overflow-hidden">
    <div className="w-full h-full bg-slate-800/50 animate-pulse flex items-center justify-center">
      <div className="space-y-4 w-full max-w-md p-4">
        <div className="h-4 bg-slate-700/50 rounded w-3/4 mx-auto"></div>
        <div className="h-32 bg-slate-700/50 rounded"></div>
        <div className="h-4 bg-slate-700/50 rounded w-1/2 mx-auto"></div>
      </div>
    </div>
  </div>
)

const ChartErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  try {
    return <>{children}</>
  } catch (error) {
    console.error('Chart rendering error:', error)
    return <div className="text-red-500">Failed to load chart</div>
  }
}

// Dynamically import chart components with loading optimization
const DynamicInventoryChart = dynamic(
  () => import('../inventory/InventoryChart'),
  {
    ssr: false,
    loading: ChartLoading
  }
)

const DynamicOrdersChart = dynamic(
  () => import('../orders/OrdersChart'),
  {
    ssr: false,
    loading: ChartLoading
  }
)

const DynamicAnalyticsChart = dynamic(
  () => import('../analytics/AnalyticsChart'),
  {
    ssr: false,
    loading: ChartLoading
  }
)

const DynamicTrendChart = dynamic(
  () => import('../analytics/TrendChart'),
  {
    ssr: false,
    loading: ChartLoading
  }
)

// Wrapper components with error boundaries and suspense
export const InventoryChartWrapper = () => (
  <ChartErrorBoundary>
    <Suspense fallback={<ChartLoading />}>
      <DynamicInventoryChart />
    </Suspense>
  </ChartErrorBoundary>
)

export const OrdersChartWrapper = () => (
  <ChartErrorBoundary>
    <Suspense fallback={<ChartLoading />}>
      <DynamicOrdersChart />
    </Suspense>
  </ChartErrorBoundary>
)

export const AnalyticsChartWrapper = () => (
  <ChartErrorBoundary>
    <Suspense fallback={<ChartLoading />}>
      <DynamicAnalyticsChart />
    </Suspense>
  </ChartErrorBoundary>
)

export const TrendChartWrapper = () => (
  <ChartErrorBoundary>
    <Suspense fallback={<ChartLoading />}>
      <DynamicTrendChart />
    </Suspense>
  </ChartErrorBoundary>
)
