"use client";

import { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { fetchMROItems } from '../../lib/api';
import { TrendingUp, Activity, CheckCircle, Clock, AlertTriangle, RotateCcw } from "lucide-react";
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
  const [dataWarning, setDataWarning] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

  useEffect(() => {
    fetchStats();
    setLastRefreshed(new Date().toLocaleString());
  }, []);

  const fetchStats = async () => {
    try {
      const items = await fetchMROItems() as MROItem[];
      // Defensive: filter out items with missing progress/category
      const validItems = items.filter(item => item && item.progress && item.category);
      const nanItems = items.length - validItems.length;
      if (items.length > 0 && nanItems / items.length > 0.5) {
        setDataWarning('Warning: Most records have missing or invalid status/category. Data quality is poor.');
      } else {
        setDataWarning(null);
      }
      // Calculate statistics
      const calculatedStats = {
        total: items.length,
        inProgress: validItems.filter(item => item.progress === "WIP" || item.progress === "ON PROGRESS").length,
        completed: validItems.filter(item => item.progress === "CLOSED").length,
        pending: validItems.filter(item => item.progress === "PENDING").length,
        byCategory: items.reduce((acc: Record<string, number>, item) => {
          let category = item && item.category ? item.category : 'Uncategorized';
          if (!category || category === 'N/A' || category === 'nan' || category === 'null' || category === 'undefined') {
            category = 'Uncategorized';
          }
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
      setStats(calculatedStats);
    } catch (error) {
      setDataWarning('Error fetching MRO stats.');
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

  // Calculate completion rate and placeholder metrics
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  // Placeholder for average processing time and revenue/cost
  const avgProcessingTime = '--';
  const revenue = '--';

  return (
    <div className="space-y-8">
      {/* Premium Data Quality Warning */}
      {dataWarning && (
        <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded shadow-sm mb-2">
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
          <span className="font-medium">{dataWarning}</span>
          <a href="#" className="ml-auto text-blue-600 underline text-sm hover:text-blue-800">Fix Data</a>
        </div>
      )}
      {/* Refresh timestamp */}
      <div className="flex items-center justify-end text-xs text-gray-400 gap-2 mb-2">
        <RotateCcw className="w-4 h-4 animate-spin-slow" />
        Last updated: {lastRefreshed}
      </div>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 shadow-lg border border-gray-100 bg-gradient-to-br from-white to-gray-50 flex flex-col gap-2 hover:shadow-xl transition-all">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-500" />
            <div>
              <div className="text-xs text-gray-500 font-semibold uppercase">Total Projects</div>
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            </div>
          </div>
        </Card>
        <Card className="p-6 shadow-lg border border-gray-100 bg-gradient-to-br from-white to-gray-50 flex flex-col gap-2 hover:shadow-xl transition-all">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <div className="text-xs text-gray-500 font-semibold uppercase">Completion Rate</div>
              <div className="text-3xl font-bold text-gray-900">{completionRate}%</div>
            </div>
          </div>
        </Card>
        <Card className="p-6 shadow-lg border border-gray-100 bg-gradient-to-br from-white to-gray-50 flex flex-col gap-2 hover:shadow-xl transition-all">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div>
              <div className="text-xs text-gray-500 font-semibold uppercase">Avg. Processing Time</div>
              <div className="text-3xl font-bold text-gray-900">{avgProcessingTime}</div>
            </div>
          </div>
        </Card>
        <Card className="p-6 shadow-lg border border-gray-100 bg-gradient-to-br from-white to-gray-50 flex flex-col gap-2 hover:shadow-xl transition-all">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-purple-500" />
            <div>
              <div className="text-xs text-gray-500 font-semibold uppercase">Revenue / Cost</div>
              <div className="text-3xl font-bold text-gray-900">{revenue}</div>
            </div>
          </div>
        </Card>
      </div>
      {/* Categories Overview */}
      <Card className="p-6 col-span-full shadow-lg border border-gray-100 bg-gradient-to-br from-white to-gray-50 mt-4">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-800">Categories Overview</h3>
        </div>
        {Object.keys(stats.byCategory).length === 0 ? (
          <div className="text-gray-400 text-center py-8">No category data available.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(stats.byCategory).map(([category, count]) => (
              <div key={category} className="flex justify-between items-center px-4 py-3 bg-white rounded-lg shadow border border-gray-100 hover:bg-yellow-50 transition-colors">
                <span className="text-base font-medium text-gray-700">{category}</span>
                <span className="text-lg font-bold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
      {/* Charts Section */}
      <MROCharts />
    </div>
  );
}
