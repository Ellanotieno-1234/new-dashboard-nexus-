import { useState, useCallback, useRef } from 'react'
import { fetchInventory, fetchOrders } from '@/lib/api'
import type { AviationPart } from '@/lib/types/aviation-parts'

interface CachedData<T> {
  data: T
  timestamp: number
}

type InventoryData = AviationPart[]
type OrdersData = Array<{
  id: number
  order_number: string
  part_number: string
  quantity: number
  status: string
  order_date: string
}>


const CACHE_DURATION = 30000 // 30 seconds cache

export function useRefreshData() {
  const inventoryCache = useRef<CachedData<InventoryData> | null>(null)
  const ordersCache = useRef<CachedData<OrdersData> | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshInventory = useCallback(async (forceFetch = false) => {
    try {
      setIsRefreshing(true)
      setError(null)

      // Check cache if not forcing fetch
      if (!forceFetch && inventoryCache.current) {
        const age = Date.now() - inventoryCache.current.timestamp
        if (age < CACHE_DURATION) {
          return inventoryCache.current.data
        }
      }

      // Fetch fresh data
      const data = await fetchInventory()
      
      // Update cache
      inventoryCache.current = {
        data,
        timestamp: Date.now()
      }
      
      return data
    } catch (err) {
      setError('Failed to refresh inventory data')
      console.error('Refresh error:', err)
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  const refreshOrders = useCallback(async (forceFetch = false) => {
    try {
      setIsRefreshing(true)
      setError(null)

      // Check cache if not forcing fetch
      if (!forceFetch && ordersCache.current) {
        const age = Date.now() - ordersCache.current.timestamp
        if (age < CACHE_DURATION) {
          return ordersCache.current.data
        }
      }

      // Fetch fresh data
      const data = await fetchOrders()
      
      // Update cache
      ordersCache.current = {
        data,
        timestamp: Date.now()
      }
      
      return data
    } catch (err) {
      setError('Failed to refresh orders data')
      console.error('Refresh error:', err)
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  return {
    refreshInventory,
    refreshOrders,
    isRefreshing,
    error
  }
}
