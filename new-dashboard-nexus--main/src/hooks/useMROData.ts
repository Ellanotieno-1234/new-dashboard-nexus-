import { useState, useEffect } from 'react';
import type { MROItem } from '../types/mro';

interface UseMRODataParams {
  category?: string;
  progress?: string;
}

interface UseMRODataReturn {
  items: MROItem[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  createItem: (item: Omit<MROItem, 'id'>) => Promise<void>;
  updateItem: (serialNumber: string, item: Partial<MROItem>) => Promise<void>;
  deleteItem: (serialNumber: string) => Promise<void>;
}

export function useMROData({ category, progress }: UseMRODataParams = {}): UseMRODataReturn {
  const [items, setItems] = useState<MROItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (progress) params.append('progress', progress);
      
      const query = params.toString() ? `?${params.toString()}` : '';
      const response = await fetch(`/api/mro/items${query}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch MRO items');
      }
      
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category, progress]);

  const refreshData = async () => {
    await fetchData();
  };

  const createItem = async (item: Omit<MROItem, 'id'>) => {
    try {
      setError(null);
      const response = await fetch('/api/mro/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error('Failed to create MRO item');
      }

      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateItem = async (serialNumber: string, item: Partial<MROItem>) => {
    try {
      setError(null);
      const response = await fetch(`/api/mro/items?serialNumber=${serialNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error('Failed to update MRO item');
      }

      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteItem = async (serialNumber: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/mro/items?serialNumber=${serialNumber}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete MRO item');
      }

      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return {
    items,
    isLoading,
    error,
    refreshData,
    createItem,
    updateItem,
    deleteItem,
  };
}