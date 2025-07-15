"use client"

import { useEffect, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { fetchOrders } from '@/lib/api'
import { useRefreshData } from '@/hooks/useRefreshData'

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
  date: string
  orders: number
  completed: number
  pending: number
}

function OrdersChart() {
  const [data, setData] = useState<ChartData[]>([])

  const { refreshOrders } = useRefreshData()

  useEffect(() => {
    const loadData = async () => {
      try {
        const ordersData = await refreshOrders(true)
        if (!ordersData?.length) {
          setData([])
          return
        }
        // Process orders data with proper typing
        const dataMap = new Map<string, ChartData>()
        
        ordersData.forEach((order: Order) => {
          const date = order.order_date
          if (!dataMap.has(date)) {
            dataMap.set(date, {
              date,
              orders: 0,
              completed: 0,
              pending: 0
            })
          }
          
          const dayData = dataMap.get(date)!
          const quantity = Number(order.quantity || 0);
          dayData.orders += quantity;
          if (order.status === 'Completed') {
            dayData.completed += quantity;
          } else if (order.status === 'Pending') {
            dayData.pending += quantity;
          }
        })

        // Convert to array, sort by date, and ensure values are numbers
        const chartData: ChartData[] = Array.from(dataMap.values())
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map(item => ({
            ...item,
            orders: Number(item.orders || 0),
            completed: Number(item.completed || 0),
            pending: Number(item.pending || 0)
          }));

        setData(chartData);
      } catch (error) {
        console.error('Failed to fetch orders data:', error)
      }
    }
    
    loadData()
    
    // Refresh data when orders are updated
    window.addEventListener('ordersUpdated', loadData)
    return () => window.removeEventListener('ordersUpdated', loadData)
  }, [refreshOrders])

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
            </linearGradient>
             <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="#4f46e5"
            fill="url(#colorOrders)"
            name="Total Orders"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="completed"
            stroke="#16a34a"
            fill="url(#colorCompleted)"
            name="Completed"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="pending"
            stroke="#dc2626"
            fill="url(#colorPending)"
            name="Pending"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export { OrdersChart }
export default OrdersChart
