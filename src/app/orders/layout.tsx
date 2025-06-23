import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
} 