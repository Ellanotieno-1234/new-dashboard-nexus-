'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

export function PageHeader({ children }: PageLayoutProps) {
  return (
    <div className="mb-8 space-y-4">
      {children}
    </div>
  );
}

export function PageTitle({ children }: PageLayoutProps) {
  return (
    <h1 className="text-3xl font-bold tracking-tight">{children}</h1>
  );
}

export function PageContent({ children }: PageLayoutProps) {
  return (
    <div className="space-y-6">
      {children}
    </div>
  );
}
