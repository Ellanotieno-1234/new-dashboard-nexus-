"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function PageLayout({ children, className, ...props }: PageLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-b from-gray-50 via-gray-50/95 to-white",
        "dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-800",
        "transition-colors duration-500",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none" />
      <div className="relative">
        <div
          className={cn(
            "container mx-auto px-4 py-8 sm:px-6 lg:px-8",
            "animate-fade-in"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function PageHeader({ children, className, ...props }: PageLayoutProps) {
  return (
    <div
      className={cn(
        "mb-8 space-y-4",
        "animate-slide-down",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function PageTitle({ children, className, ...props }: PageLayoutProps) {
  return (
    <h1
      className={cn(
        "text-4xl font-bold tracking-tight",
        "bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent",
        "dark:from-gray-100 dark:to-gray-400",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function PageContent({ children, className, ...props }: PageLayoutProps) {
  return (
    <div
      className={cn(
        "space-y-8",
        "animate-fade-in",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}