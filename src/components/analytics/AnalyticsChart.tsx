'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const mockData = [
  { month: 'Jan', value: 400 },
  { month: 'Feb', value: 300 },
  { month: 'Mar', value: 600 },
  { month: 'Apr', value: 800 },
  { month: 'May', value: 700 },
  { month: 'Jun', value: 900 },
  { month: 'Jul', value: 1000 },
];

export function AnalyticsChart() {
  const { t } = useLanguage();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={mockData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis
          dataKey="month"
          stroke="#6B7280"
          fontSize={12}
        />
        <YAxis
          stroke="#6B7280"
          fontSize={12}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(17, 24, 39, 0.8)',
            border: '1px solid rgba(107, 114, 128, 0.2)',
            borderRadius: '6px',
          }}
          labelStyle={{ color: '#E5E7EB' }}
          itemStyle={{ color: '#0EA5E9' }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#0EA5E9"
          fillOpacity={1}
          fill="url(#colorValue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
