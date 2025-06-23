"use client";

import React from "react";
import { Card } from "./card";

interface LoadingCardProps {
  className?: string;
}

export function LoadingCard({ className }: LoadingCardProps) {
  return (
    <Card className={`p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 animate-pulse ${className}`}>
      <div className="space-y-4">
        <div className="h-6 bg-gray-700/50 rounded w-24"></div>
        <div className="h-8 bg-gray-700/50 rounded w-16"></div>
      </div>
    </Card>
  );
}

export function LoadingCardGrid({ count = 4, className = "" }) {
  return (
    <div className={`grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  );
}