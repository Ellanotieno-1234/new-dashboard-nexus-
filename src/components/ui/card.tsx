"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Card = ({ className, ...props }: CardProps) => (
  <div
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow-sm backdrop-blur-sm",
      "bg-white/95 dark:bg-gray-800/95",
      "border-gray-100 dark:border-gray-700",
      "transition-all duration-200 ease-in-out",
      "hover:border-gray-200 dark:hover:border-gray-600",
      "group relative overflow-hidden",
      className
    )}
    {...props}
  />
);

export const CardHeader = ({ className, ...props }: CardProps) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 p-6",
      "bg-gray-50/50 dark:bg-gray-800/50",
      "group-hover:bg-gray-50/80 dark:group-hover:bg-gray-800/80",
      "transition-colors duration-200",
      className
    )}
    {...props}
  />
);

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

export const CardTitle = ({ className, ...props }: CardTitleProps) => (
  <h3
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      "text-gray-800 dark:text-gray-200",
      "group-hover:text-gray-900 dark:group-hover:text-white",
      "transition-colors duration-200",
      className
    )}
    {...props}
  />
);

export const CardContent = ({ className, ...props }: CardProps) => (
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
