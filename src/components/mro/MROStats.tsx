"use client";

import { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { fetchMROItems } from "../../lib/api";

interface MROItem {
  progress: string;
  category: string;
}

interface MROStats {
  total: number;
  inProgress: number;
  completed: number;
  pending: number;
  byCategory: Record<string, number>;
}

export function MROStats() {
  const [stats, setStats] = useState<MROStats>({
    total: 0,
    inProgress: 0,
    completed: 0,
    pending: 0,
    byCategory: {}
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const items = await fetchMROItems() as MROItem[];
      
      // Calculate statistics
      const calculatedStats = {
        total: items.length,
        inProgress: items.filter(item => item.progress === "WIP" || item.progress === "ON PROGRESS").length,
        completed: items.filter(item => item.progress === "CLOSED").length,
        pending: items.filter(item => item.progress === "PENDING").length,
        byCategory: items.reduce((acc: Record<string, number>, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };

      setStats(calculatedStats);
    } catch (error) {
      console.error("Error fetching MRO stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading stats...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Total Items</h3>
        <p className="text-2xl font-bold">{stats.total}</p>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
        <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Completed</h3>
        <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Pending</h3>
        <p className="text-2xl font-bold text-red-600">{stats.pending}</p>
      </Card>

      <Card className="p-4 col-span-full">
        <h3 className="text-sm font-medium text-gray-500 mb-2">By Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(stats.byCategory).map(([category, count]) => (
            <div key={category} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm font-medium">{category}</span>
              <span className="text-sm font-bold">{count}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
