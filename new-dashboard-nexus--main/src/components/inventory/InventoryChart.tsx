"use client"

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { fetchInventory } from '@/lib/api'
import { useRefreshData } from '@/hooks/useRefreshData'

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
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <YAxis label={{ value: 'Quantity', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Bar 
            dataKey="in_stock" 
            name="In Stock" 
            fill="#4f46e5"
            isAnimationActive={true}
            animationDuration={500}
          />
          <Bar 
            dataKey="min_required" 
            name="Min Required" 
            fill="#ef4444"
            isAnimationActive={true}
            animationDuration={500}
          />
          <Bar 
            dataKey="on_order" 
            name="On Order" 
            fill="#22c55e"
            isAnimationActive={true}
            animationDuration={500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
