"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { fetchAnalyticsSummary } from "@/lib/api"
import { useRefreshData } from "@/hooks/useRefreshData"

interface AnalyticsSummary {
  total_parts: number
  total_value: number
  low_stock: number
  backorders: number
  turnover_rate: number | null
  accuracy_rate: number | null
}

export function AnalyticsSummary() {
  const [summaryData, setSummaryData] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { refreshInventory, refreshOrders } = useRefreshData()

  useEffect(() => {
    async function loadSummary() {
      try {
        // Force refresh of both inventory and orders data
        await Promise.all([refreshInventory(true), refreshOrders(true)])
        const response = await fetchAnalyticsSummary()
        setSummaryData(response || {
          total_parts: 0,
          total_value: 0,
          low_stock: 0,
          backorders: 0,
          turnover_rate: 0,
          accuracy_rate: 0
        })
      } catch (err) {
        setError('Failed to load analytics data')
        console.error('Error loading analytics:', err)
      } finally {
        setLoading(false)
      }
    }

    loadSummary()

    // Listen for inventory and order updates
    const handleUpdate = () => loadSummary()
    window.addEventListener('analyticsUpdated', handleUpdate)
    return () => {
      window.removeEventListener('analyticsUpdated', handleUpdate)
    }
  }, [refreshInventory, refreshOrders])

  if (loading) {
    return <div className="text-center py-4">Loading analytics data...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>
  }

  // Use derived value instead of reassigning
  const displayData = summaryData || {
    total_parts: 0,
    total_value: 0,
    low_stock: 0,
    backorders: 0,
    turnover_rate: 0,
    accuracy_rate: 0
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{displayData.total_parts}</div>
          <div className="text-sm text-muted-foreground">Total Parts</div>
          <div className="mt-2 text-xs text-muted-foreground">
            Across all categories
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">
            ${(Number(displayData.total_value || 0) / 1000000).toFixed(2)}M
          </div>
          <div className="text-sm text-muted-foreground">Total Inventory Value</div>
          <div className="mt-2 text-xs text-muted-foreground">
            Current market value
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-yellow-600">
            {displayData.low_stock}
          </div>
          <div className="text-sm text-muted-foreground">Low Stock Alerts</div>
          <div className="mt-2 text-xs text-muted-foreground">
            Parts below minimum threshold
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-red-600">
            {displayData.backorders}
          </div>
          <div className="text-sm text-muted-foreground">Backorders</div>
          <div className="mt-2 text-xs text-muted-foreground">
            Pending fulfillment
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">
            {Number(displayData.turnover_rate || 0).toFixed(1)}x
          </div>
          <div className="text-sm text-muted-foreground">Inventory Turnover</div>
          <div className="mt-2 text-xs text-muted-foreground">
            Annual average
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-green-600">
            {Number(displayData.accuracy_rate || 0).toFixed(1)}%
          </div>
          <div className="text-sm text-muted-foreground">Inventory Accuracy</div>
          <div className="mt-2 text-xs text-muted-foreground">
            Based on last audit
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
