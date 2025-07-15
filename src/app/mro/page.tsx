"use client";

import { useEffect, useState } from "react";
import { MROTable } from "@/components/mro/MROTable";
import { MROForm } from "@/components/mro/MROForm";
import { MROStats } from "@/components/mro/MROStats";
import { FileUploader } from "@/components/inventory/FileUploader";
import { Card } from "@/components/ui/card";
import { 
  Wrench, 
  Clock, 
  FileText,
  Package,
  RotateCcw
} from "lucide-react";
import { useMROData } from "@/hooks/useMROData";
import { type MROItem, type Progress } from "@/types/mro";
import Link from "next/link";

export default function MROPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [mroItems, setMroItems] = useState<MROItem[]>([]);
  const { items: fetchedItems, isLoading } = useMROData();

  useEffect(() => {
    if (fetchedItems) {
      setMroItems(fetchedItems);
    }
  }, [fetchedItems]);
  const lastUpdated = new Date().toLocaleString();

  const handleDataChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex flex-col gap-8 p-8 max-w-[1920px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Wrench className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                MRO Management Dashboard
              </h1>
              <p className="text-gray-500 mt-1">
                Manage and track maintenance, repair, and operations items
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/mro/job-tracker"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Go to Job Tracker
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Last updated: {lastUpdated}</span>
            </div>
            <button
              onClick={handleDataChange}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Refresh data"
            >
              <RotateCcw className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Active Items: {mroItems?.length ?? 0}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            <span>In Progress: {mroItems?.filter((item: MROItem) => item.progress === "WIP" as Progress).length ?? 0}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span>Categories: {new Set(mroItems?.map((item: MROItem) => item.category)).size ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-8">
        <MROStats key={`stats-${refreshKey}`} />
        
        <Card className="p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Upload MRO Data</h2>
              <p className="text-sm text-gray-500">Upload Excel file with MRO items</p>
            </div>
          </div>
          <FileUploader type="mro" onUploadSuccess={handleDataChange} />
        </Card>

        <Card className="p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <FileText className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Add New MRO Item</h2>
              <p className="text-sm text-gray-500">Create a new maintenance, repair, or operations entry</p>
            </div>
          </div>
          <MROForm onSuccess={handleDataChange} />
        </Card>

        <Card className="p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Package className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">MRO Items Overview</h2>
              <p className="text-sm text-gray-500">View and manage all maintenance, repair, and operations items</p>
            </div>
          </div>
          <MROTable key={`table-${refreshKey}`} />
        </Card>
      </div>
    </div>
  );
}
