"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fetchInventory } from "@/lib/api"

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

export function InventoryTable() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadInventory = async () => {
    try {
      setLoading(true)
      const data = await fetchInventory()
      setInventory(data || [])
      setError(null)
    } catch (err) {
      setError('Failed to load inventory data')
      console.error('Error loading inventory:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInventory()

    // Listen for inventory update events
    const handleInventoryUpdate = () => {
      loadInventory()
    }

    window.addEventListener('inventoryUpdated', handleInventoryUpdate)
    return () => window.removeEventListener('inventoryUpdated', handleInventoryUpdate)
  }, [])

  if (loading) {
    return <div className="text-center py-4">Loading inventory data...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Part Number</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">In Stock</TableHead>
          <TableHead className="text-right">Min. Required</TableHead>
          <TableHead className="text-right">On Order</TableHead>
          <TableHead>Last Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inventory.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.part_number}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell className="text-right">{item.in_stock}</TableCell>
            <TableCell className="text-right">{item.min_required}</TableCell>
            <TableCell className="text-right">{item.on_order}</TableCell>
            <TableCell>{item.last_updated}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
