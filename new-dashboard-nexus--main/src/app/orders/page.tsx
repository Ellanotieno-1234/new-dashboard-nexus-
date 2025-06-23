"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { useLanguage } from '../../lib/i18n/LanguageContext';
import { OrdersTable } from "../../components/orders/OrdersTable";
import { FileUploader } from "../../components/inventory/FileUploader";
import { OrdersChartWrapper } from "../../components/wrappers/ChartWrapper";
import { PageLayout, PageHeader, PageTitle, PageContent } from "../../components/layout/PageLayout";

export default function OrdersPage() {
  const { t } = useLanguage();
  
  return (
    <PageLayout>
      <PageHeader>
        <PageTitle>{t('orders.title')}</PageTitle>
      </PageHeader>
      
      <PageContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
          <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:bg-gray-900/60 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-gray-900/20">
            <CardHeader className="border-b border-gray-700/50">
              <CardTitle className="text-gray-100">{t('orders.upload.title')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <FileUploader />
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:bg-gray-900/60 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-gray-900/20">
            <CardHeader className="border-b border-gray-700/50">
              <CardTitle className="text-gray-100">{t('orders.overview.title')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <OrdersChartWrapper />
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:bg-gray-900/60 transition-all duration-200 animate-fade-in">
          <CardHeader className="border-b border-gray-700/50">
            <CardTitle className="text-gray-100">{t('orders.recent.title')}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <OrdersTable />
          </CardContent>
        </Card>
      </PageContent>
    </PageLayout>
  );
}
