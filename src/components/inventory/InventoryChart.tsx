"use client"

import { useEffect, useState } from 'react'
import { RadialBarChart, RadialBar, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { fetchInventory } from '@/lib/api'
import { useRefreshData } from '@/hooks/useRefreshData'
import { LucideIcon } from "lucide-react"

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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="p-2 bg-gray-700 text-white rounded-md border border-gray-600">
        <p className="font-bold">{data.name}</p>
        <p>In Stock: {data.in_stock}</p>
        <p>Min Required: {data.min_required}</p>
      </div>
    )
  }
  return null
}

export default function InventoryChart() {
  const [data, setData] = useState<InventoryItem[]>([])

  const { refreshInventory } = useRefreshData()

  useEffect(() => {
    const loadData = async () => {
      try {
        const inventoryData = await refreshInventory(true)
        setData(inventoryData || [])
      } catch (error) {
        console.error('Failed to fetch inventory data:', error)
      }
    }

    loadData()
    
    // Refresh data when inventory is updated
    const handleUpdate = () => loadData()
    window.addEventListener('inventoryUpdated', handleUpdate)
    return () => window.removeEventListener('inventoryUpdated', handleUpdate)
  }, [refreshInventory])

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height={300}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="10%"
          outerRadius="80%"
          barSize={10}
          data={data.map(item => ({ ...item, fill: item.in_stock < item.min_required ? '#ef4444' : '#22c55e' }))}
        >
          <RadialBar
            background
            dataKey="in_stock"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  )
}
