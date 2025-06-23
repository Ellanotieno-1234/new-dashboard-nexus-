"use client";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { useLanguage } from "lib/i18n/LanguageContext";
import { OrdersTable } from "components/orders/OrdersTable";
import { FileUploader } from "components/inventory/FileUploader";
import { OrdersChartWrapper } from "components/wrappers/ChartWrapper";
import { PageLayout, PageHeader, PageTitle, PageContent } from "components/layout/PageLayout";

export default function OrdersPage() {
  const { t } = useLanguage();
  
  return (
    <PageLayout>
      <PageHeader>
        <PageTitle>{t('orders.title')}</PageTitle>
      </PageHeader>
      
      <PageContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('orders.upload.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploader />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('orders.overview.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <OrdersChartWrapper />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('orders.recent.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <OrdersTable />
          </CardContent>
        </Card>
      </PageContent>
    </PageLayout>
  );
}
