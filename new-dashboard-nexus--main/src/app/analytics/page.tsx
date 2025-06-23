"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { AnalyticsSummary } from "../../components/analytics/AnalyticsSummary"
import { FileUploader } from "../../components/inventory/FileUploader"
import { AnalyticsChartWrapper, TrendChartWrapper } from "../../components/wrappers/ChartWrapper"

export default function AnalyticsPage() {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{t('analytics.title')}</h1>
      
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.upload.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUploader />
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <AnalyticsSummary />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  )
}
