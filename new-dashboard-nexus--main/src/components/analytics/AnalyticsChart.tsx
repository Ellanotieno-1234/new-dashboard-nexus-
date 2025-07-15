"use client"

import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { fetchInventory, fetchOrders } from '@/lib/api'

interface InventoryItem {
  id: number
  part_number: string
  name: string
  category: string
  in_stock: number
  min_required: number
  on_order: number
  last_updated: string
}

interface Order {
  id: number
  order_number: string
  part_number: string
  part_name: string
  quantity: number
  status: string
  order_date: string
  expected_delivery: string
  supplier: string
}

interface ChartData {
  category: string
  demand: number
  supply: number
  backorder: number
  forecast: number
}

function AnalyticsChart() {
  const [data, setData] = useState<ChartData[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [inventoryResponse, ordersResponse] = await Promise.all([
          fetchInventory(),
          fetchOrders()
        ])
        
        const inventoryData = Array.isArray(inventoryResponse) ? inventoryResponse : (inventoryResponse?.data || [])
        const ordersData = Array.isArray(ordersResponse) ? ordersResponse : (ordersResponse?.data || [])

        // Group inventory by category
        const categoryMap = new Map<string, ChartData>()

        // Process inventory data
        inventoryData.forEach((item: InventoryItem) => {
        const category = item.category || 'Uncategorized';
        if (!categoryMap.has(category)) {
            categoryMap.set(category, {
              category,
              demand: 0,
              supply: 0,
              backorder: 0,
              forecast: 0
            })
          }

          const categoryData = categoryMap.get(category)!
          categoryData.supply += item.in_stock || 0
        })

        // Process orders data to calculate demand and backorders
        ordersData.forEach((order: Order) => {
          const item = inventoryData.find((i: InventoryItem) => i.part_number === order.part_number)
          if (item) {
          const categoryData = categoryMap.get(item.category || 'Uncategorized')!
            categoryData.demand += order.quantity || 0
            if (order.status === 'Pending') {
              categoryData.backorder += order.quantity
            }
          }
        })

        // Calculate forecast based on current demand plus 10%
        for (const categoryData of categoryMap.values()) {
          // Ensure forecast is a safe number
  const demand = categoryData.demand || 0
  const forecast = Math.max(0, demand * 1.1);
          categoryData.forecast = Math.round(forecast);
        }

        setData(Array.from(categoryMap.values()))
      } catch (error) {
        console.error('Failed to fetch analytics data:', error)
      }
    }

    loadData()

    // Refresh when either inventory or orders are updated
    window.addEventListener('inventoryUpdated', loadData)
    window.addEventListener('ordersUpdated', loadData)
    return () => {
      window.removeEventListener('inventoryUpdated', loadData)
      window.removeEventListener('ordersUpdated', loadData)
    }
  }, [])

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="demand" fill="#4f46e5" name="Current Demand" />
          <Bar dataKey="supply" fill="#16a34a" name="Current Supply" />
          <Bar dataKey="forecast" fill="#0891b2" name="Forecasted Demand" />
          <Bar dataKey="backorder" fill="#dc2626" name="Backorder" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export { AnalyticsChart }
export default AnalyticsChart
