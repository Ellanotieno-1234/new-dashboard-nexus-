"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fetchOrders } from "@/lib/api"

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

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadOrders = async () => {
    try {
      setLoading(true)
      const response = await fetchOrders()
      setOrders(Array.isArray(response) ? response : response.data || [])
      setError(null)
    } catch (err) {
      setError('Failed to load orders data')
      console.error('Error loading orders:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()

    // Listen for orders update events
    const handleOrdersUpdate = () => {
      loadOrders()
    }

    window.addEventListener('ordersUpdated', handleOrdersUpdate)
    return () => window.removeEventListener('ordersUpdated', handleOrdersUpdate)
  }, [])

  if (loading) {
    return <div className="text-center py-4">Loading orders data...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order Number</TableHead>
          <TableHead>Part Number</TableHead>
          <TableHead>Part Name</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Order Date</TableHead>
          <TableHead>Expected Delivery</TableHead>
          <TableHead>Supplier</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.order_number}</TableCell>
            <TableCell>{order.part_number}</TableCell>
            <TableCell>{order.part_name}</TableCell>
            <TableCell className="text-right">{order.quantity}</TableCell>
            <TableCell>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                order.status === "Completed" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {order.status}
              </span>
            </TableCell>
            <TableCell>{order.order_date}</TableCell>
            <TableCell>{order.expected_delivery}</TableCell>
            <TableCell>{order.supplier}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
