'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const mockStats = {
  totalOrders: 156,
  averageValue: 2847,
  orderGrowth: 12.5,
  monthlyRevenue: 443200,
};

export function AnalyticsSummary() {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
        <div className="text-sm text-gray-400">{t('analytics.summary.totalOrders')}</div>
        <div className="text-2xl font-bold text-white mt-2">{mockStats.totalOrders}</div>
      </div>
      
      <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
        <div className="text-sm text-gray-400">{t('analytics.summary.averageValue')}</div>
        <div className="text-2xl font-bold text-white mt-2">
          ${mockStats.averageValue.toLocaleString()}
        </div>
      </div>
      
      <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
        <div className="text-sm text-gray-400">{t('analytics.summary.orderGrowth')}</div>
        <div className="text-2xl font-bold text-green-400 mt-2">
          +{mockStats.orderGrowth}%
        </div>
      </div>
      
      <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
        <div className="text-sm text-gray-400">{t('analytics.summary.monthlyRevenue')}</div>
        <div className="text-2xl font-bold text-white mt-2">
          ${mockStats.monthlyRevenue.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
