"use client";

import { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { fetchMROItems } from "../../lib/api";
import { TrendingUp, Activity, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { MROCharts } from "./MROCharts";

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
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </div>
            </Card>
          ))}
          <Card className="p-4 col-span-full">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const getTrendIcon = (value: number) => {
    if (value > 5) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (value < 3) return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
    return <TrendingUp className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Items</h3>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-2xl font-bold">{stats.total}</p>
                {getTrendIcon(stats.total)}
              </div>
            </div>
            <Activity className="w-8 h-8 text-blue-500 opacity-75" />
          </div>
        </Card>
        
        <Card className="p-4 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
                {getTrendIcon(stats.inProgress)}
              </div>
            </div>
            <Clock className="w-8 h-8 text-yellow-500 opacity-75" />
          </div>
        </Card>
        
        <Card className="p-4 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Completed</h3>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                {getTrendIcon(stats.completed)}
              </div>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500 opacity-75" />
          </div>
        </Card>
        
        <Card className="p-4 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Pending</h3>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-2xl font-bold text-red-600">{stats.pending}</p>
                {getTrendIcon(stats.pending)}
              </div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500 opacity-75" />
          </div>
        </Card>

        <Card className="p-4 col-span-full">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-500">Categories Overview</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(stats.byCategory).map(([category, count]) => (
              <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                <span className="text-sm font-medium">{category}</span>
                <span className="text-sm font-bold">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <MROCharts />
    </div>
  );
}
