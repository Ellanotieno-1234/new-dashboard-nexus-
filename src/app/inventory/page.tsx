"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { FileUploader } from "@/components/inventory/FileUploader";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { PageHeader, PageTitle, PageContent } from "@/components/layout/PageLayout";

export default function InventoryPage() {
  const { t } = useLanguage();
  
  const handleUploadSuccess = () => {
    // Dispatch event to trigger inventory table refresh
    window.dispatchEvent(new Event('inventoryUpdated'));
  };
  
  return (
    <>
      <PageHeader>
        <PageTitle>{t('inventory.title')}</PageTitle>
      </PageHeader>
      <PageContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('inventory.upload.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploader type="inventory" onUploadSuccess={handleUploadSuccess} />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{t('inventory.items.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <InventoryTable />
          </CardContent>
        </Card>
      </PageContent>
    </>
  );
}
