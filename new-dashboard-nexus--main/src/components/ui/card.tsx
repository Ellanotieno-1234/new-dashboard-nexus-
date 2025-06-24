"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Card = ({ className, ...props }: CardProps) => (
  <div
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow-sm backdrop-blur-sm",
      "bg-white/95 dark:bg-gray-800/95",
      "border-gray-100 dark:border-gray-700",
      "transition-all duration-200 ease-in-out",
      "hover:border-gray-200 dark:hover:border-gray-600",
      "hover:shadow-lg dark:hover:shadow-gray-800/50",
      "group relative overflow-hidden",
      "card-hover-effect",
      className
    )}
    {...props}
  />
);

const CardHeader = ({ className, ...props }: CardProps) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 p-6",
      "bg-gray-50/50 dark:bg-gray-800/50",
      "group-hover:bg-gray-50/80 dark:group-hover:bg-gray-800/80",
      "border-b border-gray-100 dark:border-gray-700",
      "transition-colors duration-200",
      className
    )}
    {...props}
  />
);

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

const CardTitle = ({ className, ...props }: CardTitleProps) => (
  <h3
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      "text-gray-800 dark:text-gray-200",
      "group-hover:text-gray-900 dark:group-hover:text-white",
      "transition-colors duration-200",
      "gradient-text",
      className
    )}
    {...props}
  />
);

const CardContent = ({ className, ...props }: CardProps) => (
  <div
    className={cn(
      "p-6 pt-0",
      "bg-transparent",
      "transition-colors duration-200",
      className
    )}
    {...props}
  />
);

const CardFooter = ({ className, ...props }: CardProps) => (
  <div
    className={cn(
      "flex items-center p-6 pt-0",
      "bg-transparent",
      "transition-colors duration-200",
      className
    )}
    {...props}
  />
);
CardFooter.displayName = "CardFooter";

function LoadingCard({ className }: { className?: string }) {
  return (
    <Card className={`p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 animate-pulse ${className}`}>
      <div className="space-y-4">
        <div className="h-6 bg-gray-700/50 rounded w-24"></div>
        <div className="h-8 bg-gray-700/50 rounded w-16"></div>
      </div>
    </Card>
  );
}

function LoadingCardGrid({ count = 4, className = "" }) {
  return (
    <div className={`grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardContent,
  LoadingCard,
  LoadingCardGrid,
};