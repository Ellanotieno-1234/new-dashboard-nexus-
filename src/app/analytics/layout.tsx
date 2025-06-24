import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
} 