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
  CartesianGrid,
  LabelList
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

  // Prepare data for horizontal bar chart (progress distribution)
  const progressData = prepareProgressData().map(d => ({ ...d, percent: items.length > 0 ? ((d.value / items.length) * 100).toFixed(1) : '0' }));

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      {dataWarning && (
        <div className="p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded mb-2 text-sm col-span-full">
          {dataWarning}
        </div>
      )}
      {/* Progress Distribution Horizontal Bar Chart */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Progress Distribution</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={progressData}
            layout="vertical"
            margin={{ top: 20, right: 40, left: 40, bottom: 40 }}
            barCategoryGap={24}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 14, fill: '#334155' }} width={120} />
            <Tooltip formatter={(value: any, name: any, props: any) => [`${value} items`, 'Count']} />
            <Legend />
            <Bar dataKey="value" fill="#0ea5e9" radius={[8, 8, 8, 8]}>
              <LabelList dataKey="value" position="right" fill="#0ea5e9" fontSize={14} />
              <LabelList dataKey="percent" position="insideRight" fill="#64748b" fontSize={12} formatter={(v: any) => `${v}%`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Category Breakdown Bar Chart */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Category Breakdown</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={prepareCategoryData()} margin={{ top: 20, right: 40, left: 40, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#64748b' }} angle={-30} textAnchor="end" interval={0} height={60} />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="CLOSED" stackId="a" fill={COLORS.CLOSED} radius={[8, 8, 0, 0]}>
              <LabelList dataKey="CLOSED" position="top" fill={COLORS.CLOSED} fontSize={12} />
            </Bar>
            <Bar dataKey="WIP" stackId="a" fill={COLORS.WIP} radius={[8, 8, 0, 0]}>
              <LabelList dataKey="WIP" position="top" fill={COLORS.WIP} fontSize={12} />
            </Bar>
            <Bar dataKey="PENDING" stackId="a" fill={COLORS.PENDING} radius={[8, 8, 0, 0]}>
              <LabelList dataKey="PENDING" position="top" fill={COLORS.PENDING} fontSize={12} />
            </Bar>
            <Bar dataKey="Unknown" stackId="a" fill={COLORS.DEFAULT} radius={[8, 8, 0, 0]}>
              <LabelList dataKey="Unknown" position="top" fill={COLORS.DEFAULT} fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Timeline Chart (unchanged) */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 col-span-full">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Timeline Overview</h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={prepareTimelineData()} margin={{ top: 20, right: 40, left: 40, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} angle={-30} textAnchor="end" interval={0} height={60} />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#0ea5e9" strokeWidth={2} name="Total Items" />
            <Line type="monotone" dataKey="CLOSED" stroke={COLORS.CLOSED} strokeWidth={2} />
            <Line type="monotone" dataKey="WIP" stroke={COLORS.WIP} strokeWidth={2} />
            <Line type="monotone" dataKey="PENDING" stroke={COLORS.PENDING} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
