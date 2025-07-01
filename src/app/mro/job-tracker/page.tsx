"use client";

import { Card } from "@/components/ui/card";
import { Clock, Wrench, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function JobTrackerPage() {
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
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-8">
        <Card className="p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Job Tracker</h2>
              <p className="text-sm text-gray-500">Track maintenance jobs and their progress</p>
            </div>
          </div>
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Job tracker functionality coming soon</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
