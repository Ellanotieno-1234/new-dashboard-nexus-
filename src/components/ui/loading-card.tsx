import React from "react";

// Add className prop to support custom styling
export const LoadingCard = ({ className = "" }: { className?: string }) => (
  <div className={className}>Loading...</div>
);
