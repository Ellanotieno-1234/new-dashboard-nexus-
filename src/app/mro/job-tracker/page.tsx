"use client";

import { Wrench } from "lucide-react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";
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
                    // Validate file size (100MB limit)
                    const maxSize = 100 * 1024 * 1024; // 100MB
                    if (file.size > maxSize) {
                      alert(`File too large. Maximum size is 100MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`);
                      return;
                    }

                    try {
                      const formData = new FormData();
                      formData.append('file', file);
                      
                      console.log(`Starting upload of ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
                      
                      const response = await fetch('/api/mro/job-tracker/upload', {
                        method: 'POST',
                        body: formData
                      });
                      
                      const result = await response.json();
                      if (response.ok) {
                        alert(`Upload successful: ${result.inserted_count || 0} items processed from ${result.total_items || 0} total rows`);
                        refreshData();
                      } else {
                        throw new Error(result.detail || result.error || result.message || 'Upload failed');
                      }
                    } catch (error) {
                      console.error('Upload error:', error);
                      
                      let errorMessage = 'Upload failed';
                      if (error instanceof Error) {
                        errorMessage = error.message;
                        
                        // Handle specific error cases
                        if (error.message.includes('502') || error.message.includes('Bad Gateway')) {
                          errorMessage = 'Server timeout - file too large or processing taking too long. Try splitting the file into smaller parts (under 10MB).';
                        } else if (error.message.includes('413')) {
                          errorMessage = 'File too large. Please use files under 100MB.';
                        } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
                          errorMessage = 'Network error - please check your connection and try again.';
                        }
                      }
                      
                      alert(`Upload error: ${errorMessage}`);
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
                  <TableHead>Job Card</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Part Number</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Expected Release</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.job_card_no || 'N/A'}</TableCell>
                    <TableCell>{item.customer}</TableCell>
                    <TableCell>{item.part_number}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.progress}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.expected_release_date ? new Date(item.expected_release_date).toLocaleDateString() : 'N/A'}</TableCell>
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
