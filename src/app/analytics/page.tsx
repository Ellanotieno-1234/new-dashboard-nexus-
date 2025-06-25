"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { AnalyticsSummary } from "@/components/analytics/AnalyticsSummary";
import { FileUploader } from "@/components/inventory/FileUploader";
import { AnalyticsChartWrapper, TrendChartWrapper } from "@/components/wrappers/ChartWrapper";
import { PageHeader, PageTitle, PageContent } from "@/components/layout/PageLayout";
import { useState } from "react";

export default function AnalyticsPage() {
  const { t } = useLanguage();
  const [uploadType, setUploadType] = useState<'inventory' | 'orders'>('inventory');
  
  const handleUploadSuccess = () => {
    // Dispatch events to refresh both tables since analytics shows both
    window.dispatchEvent(new Event('inventoryUpdated'));
    window.dispatchEvent(new Event('ordersUpdated'));
  };
  
  return (
    <>
      <PageHeader>
        <PageTitle>{t('analytics.title')}</PageTitle>
      </PageHeader>
      <PageContent>
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.upload.title')}</CardTitle>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => setUploadType('inventory')}
                className={`px-4 py-2 rounded-lg ${
                  uploadType === 'inventory' 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Inventory Data
              </button>
              <button
                onClick={() => setUploadType('orders')}
                className={`px-4 py-2 rounded-lg ${
                  uploadType === 'orders' 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Orders Data
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <FileUploader type={uploadType} onUploadSuccess={handleUploadSuccess} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.summary.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsSummary />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.demand.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <AnalyticsChartWrapper />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.trends.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendChartWrapper />
            </CardContent>
          </Card>
        </div>
      </PageContent>
    </>
  );
}
