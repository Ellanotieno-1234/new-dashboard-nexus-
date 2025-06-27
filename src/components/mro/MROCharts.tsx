"use client";

import { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { fetchMROItems } from '@/lib/api';
import { Activity } from 'lucide-react';

interface MROItem {
  id: string;
  customer: string;
  part_number: string;
  description: string;
  serial_number: string;
  date_delivered: string;
  work_requested: string;
  progress: string;
  location: string;
  expected_release_date: string;
  remarks: string;
  category: string;
}

const COLORS = {
  CLOSED: '#22c55e',
  WIP: '#eab308',
  PENDING: '#ef4444',
  DEFAULT: '#64748b'
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-lg">
        <p className="font-semibold">{label}</p>
        <p className="text-sm">Count: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export function MROCharts() {
  const [items, setItems] = useState<MROItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataWarning, setDataWarning] = useState<string | null>(null);

  useEffect(() => {
    loadMROItems();
  }, []);

  const loadMROItems = async () => {
    try {
      const data = await fetchMROItems();
      setItems(data);
      // Warn if most items have missing/invalid progress or category
      const invalid = data.filter((item: MROItem) => !item.progress || !item.category || item.progress === 'nan' || item.category === 'nan');
      if (data.length > 0 && invalid.length / data.length > 0.5) {
        setDataWarning('Warning: Most records have missing or invalid status/category. Data quality is poor.');
      } else {
        setDataWarning(null);
      }
      setLoading(false);
    } catch (error) {
      setDataWarning('Error fetching MRO items.');
      console.error("Error fetching MRO items:", error);
      setLoading(false);
    }
  };

  const prepareProgressData = () => {
    const progressCounts: { [key: string]: number } = {};
    items.forEach((item: MROItem) => {
      let progress = item.progress;
      if (!progress || progress === 'nan' || progress === 'N/A' || progress === 'null' || progress === 'undefined') {
        progress = 'Unknown';
      }
      progressCounts[progress] = (progressCounts[progress] || 0) + 1;
    });
    return Object.entries(progressCounts).map(([name, value]) => ({ name, value }));
  };

  const prepareCategoryData = () => {
    const categoryData: { [key: string]: { [key: string]: number } } = {};
    items.forEach((item: MROItem) => {
      let category = item.category;
      if (!category || category === 'nan' || category === 'N/A' || category === 'null' || category === 'undefined') {
        category = 'Uncategorized';
      }
      if (!categoryData[category]) {
        categoryData[category] = { CLOSED: 0, WIP: 0, PENDING: 0, Unknown: 0 };
      }
      let progress = item.progress;
      if (!progress || progress === 'nan' || progress === 'N/A' || progress === 'null' || progress === 'undefined') {
        progress = 'Unknown';
      }
      categoryData[category][progress] = (categoryData[category][progress] || 0) + 1;
    });
    return Object.entries(categoryData).map(([category, counts]) => ({
      category,
      ...counts
    }));
  };

  const prepareTimelineData = () => {
    const timelineData: { [key: string]: { [key: string]: number } } = {};
    items.forEach(item => {
      const date = new Date(item.date_delivered).toLocaleDateString();
      if (!timelineData[date]) {
        timelineData[date] = { CLOSED: 0, WIP: 0, PENDING: 0, total: 0 };
      }
      timelineData[date][item.progress]++;
      timelineData[date].total++;
    });

    return Object.entries(timelineData)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([date, counts]) => ({
        date,
        ...counts
      }));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-[300px] bg-gray-100 rounded flex items-center justify-center">
                <Activity className="w-12 h-12 text-gray-300 animate-spin" />
              </div>
            </div>
          </div>
        ))}
        <div className="bg-white p-4 rounded-lg shadow col-span-full">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-[300px] bg-gray-100 rounded flex items-center justify-center">
              <Activity className="w-12 h-12 text-gray-300 animate-spin" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {dataWarning && (
        <div className="p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded mb-2 text-sm col-span-full">
          {dataWarning}
        </div>
      )}
      {/* Progress Distribution Pie Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Progress Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={prepareProgressData()}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {prepareProgressData().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || COLORS.DEFAULT} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown Bar Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={prepareCategoryData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="CLOSED" stackId="a" fill={COLORS.CLOSED} />
            <Bar dataKey="WIP" stackId="a" fill={COLORS.WIP} />
            <Bar dataKey="PENDING" stackId="a" fill={COLORS.PENDING} />
            <Bar dataKey="Unknown" stackId="a" fill={COLORS.DEFAULT} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Timeline Chart */}
      <div className="bg-white p-4 rounded-lg shadow col-span-full">
        <h3 className="text-lg font-semibold mb-4">Timeline Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={prepareTimelineData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#0ea5e9" 
              strokeWidth={2}
              name="Total Items" 
            />
            <Line 
              type="monotone" 
              dataKey="CLOSED" 
              stroke={COLORS.CLOSED} 
              strokeWidth={2} 
            />
            <Line 
              type="monotone" 
              dataKey="WIP" 
              stroke={COLORS.WIP} 
              strokeWidth={2} 
            />
            <Line 
              type="monotone" 
              dataKey="PENDING" 
              stroke={COLORS.PENDING} 
              strokeWidth={2} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
