"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { FileUploader } from "@/components/inventory/FileUploader";
import { PageHeader, PageTitle, PageContent } from "@/components/layout/PageLayout";

export default function OrdersPage() {
  const { t } = useLanguage();
  
  const handleUploadSuccess = () => {
    // Dispatch event to trigger orders table refresh
    window.dispatchEvent(new Event('ordersUpdated'));
  };
  
  return (
    <>
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
              <FileUploader type="orders" onUploadSuccess={handleUploadSuccess} />
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
    </>
  );
}
