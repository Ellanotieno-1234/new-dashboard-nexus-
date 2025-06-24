'use client';

import React from 'react';
import { AnalyticsChart } from '@/components/analytics/AnalyticsChart';
import { TrendChart } from '@/components/analytics/TrendChart';

export function AnalyticsChartWrapper() {
  return (
    <div className="h-[400px] w-full">
      <AnalyticsChart />
    </div>
  );
}

export function TrendChartWrapper() {
  return (
    <div className="h-[400px] w-full">
      <TrendChart />
    </div>
  );
}
