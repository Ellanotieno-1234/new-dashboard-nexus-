"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { AnalyticsSummary } from "@/components/analytics/AnalyticsSummary";
import { FileUploader } from "@/components/inventory/FileUploader";
import { AnalyticsChartWrapper, TrendChartWrapper } from "@/components/wrappers/ChartWrapper";
import { PageHeader, PageTitle, PageContent } from "@/components/layout/PageLayout";

export default function AnalyticsPage() {
  const { t } = useLanguage();
  
  return (
    <>
      <PageHeader>
        <PageTitle>{t('analytics.title')}</PageTitle>
      </PageHeader>
      <PageContent>
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.upload.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUploader />
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
