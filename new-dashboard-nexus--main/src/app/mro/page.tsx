"use client";

import { useEffect, useState } from "react";
import { MROTable } from "@/components/mro/MROTable";
import { MROForm } from "@/components/mro/MROForm";
import { MROStats } from "@/components/mro/MROStats";
import { Card } from "@/components/ui/card";

interface RefreshProps {
  key: number;
}

export default function MROPage() {
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const handleDataChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">MRO Management</h1>
      </div>

      <div className="grid gap-6">
        <MROStats key={`stats-${refreshKey}`} />
        
        <Card className="p-6 bg-gray-900/50">
          <h2 className="text-xl font-semibold mb-4 text-white">Add New MRO Item</h2>
          <MROForm onSuccess={handleDataChange} />
        </Card>

        <Card className="p-6 bg-gray-900/50">
          <h2 className="text-xl font-semibold mb-4 text-white">MRO Items</h2>
          <MROTable key={`table-${refreshKey}`} />
        </Card>
      </div>
    </div>
  );
}
