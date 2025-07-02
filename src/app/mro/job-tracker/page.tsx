"use client";

import { Wrench } from "lucide-react";
import Link from "next/link";
import { JobTrackerForm } from "@/components/mro/JobTrackerForm";
import { useJobTrackerData } from "@/hooks/useJobTrackerData";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function JobTrackerPage() {
  const { items, isLoading, error, refreshData } = useJobTrackerData();

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
                Job Tracker
              </h1>
              <p className="text-gray-500 mt-1">
                Track and manage maintenance jobs
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/mro"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              Back to MRO Dashboard
            </Link>
            <label className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer">
              Upload Excel
              <input 
                type="file" 
                className="hidden"
                accept=".xlsx,.xls"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const formData = new FormData();
                      formData.append('file', file);
                      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/mro/job-tracker/upload`, {
                        method: 'POST',
                        body: formData
                      });
                      const result = await response.json();
                      if (response.ok) {
                        alert(`Upload successful: ${result.inserted_count} items processed`);
                        refreshData();
                      } else {
                        throw new Error(result.message || 'Upload failed');
                      }
                    } catch (error) {
                      alert(`Upload error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                    }
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-8">
        <JobTrackerForm 
          initialData={{}}
          onSave={async (data) => {
            // TODO: Implement save functionality
            console.log("Saving job tracker data:", data);
            await refreshData();
          }}
        />

        <Card className="p-6 shadow-md">
          {isLoading ? (
            <div className="text-center py-8">Loading job tracker data...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.job_card_no}</TableCell>
                    <TableCell>{item.customer}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.job_status}</TableCell>
                    <TableCell>{new Date(item.updated_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
}
