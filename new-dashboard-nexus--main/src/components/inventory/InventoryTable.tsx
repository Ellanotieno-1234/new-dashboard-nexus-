"use client";

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fetchInventory } from "@/lib/api"

interface InventoryItem {
  id: string
  name: string
  quantity: number
  status: string
  lastUpdated: string
}

export function InventoryTable() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const data = await fetchInventory()
        setItems(data)
      } catch (error) {
        console.error("Error loading inventory:", error)
      } finally {
        setLoading(false)
      }
    }

    loadInventory()
  }, [])

  if (loading) {
    return <div className="text-center py-4">Loading inventory...</div>
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No items found
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                    ${item.status === 'In Stock' ? 'bg-green-100 text-green-800' :
                    item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'}`}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(item.lastUpdated).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
