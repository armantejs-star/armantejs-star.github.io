import React from 'react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-slate-200 rounded-md ${className}`} 
      aria-hidden="true"
    />
  );
}

// Pre-built variant for a text input block
export function InputSkeleton() {
  return (
    <div className="flex flex-col space-y-2 w-full">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

// Pre-built variant for a receipt row (used for our tax breakdowns later)
export function ReceiptRowSkeleton() {
  return (
    <div className="flex justify-between items-center w-full py-2">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  );
}