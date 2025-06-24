import NexusOSDashboard from '@/components/dashboard/NexusOSDashboard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kenya Airways NEXUS - Dashboard',
  description: 'Aviation Parts Management System Dashboard',
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <NexusOSDashboard />
    </DashboardLayout>
  );
}
