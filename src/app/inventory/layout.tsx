import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
} 