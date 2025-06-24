'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const mockData = [
  { week: 'W1', orders: 40, inventory: 100 },
  { week: 'W2', orders: 30, inventory: 90 },
  { week: 'W3', orders: 60, inventory: 85 },
  { week: 'W4', orders: 80, inventory: 70 },
  { week: 'W5', orders: 70, inventory: 65 },
  { week: 'W6', orders: 90, inventory: 55 },
  { week: 'W7', orders: 100, inventory: 45 },
];

export function TrendChart() {
  const { t } = useLanguage();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={mockData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis
          dataKey="week"
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
        <Line
          type="monotone"
          dataKey="orders"
          stroke="#0EA5E9"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="inventory"
          stroke="#10B981"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
