'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';
import { Skeleton } from '@/components/dashboard/loading-skeletons';

export function AdminStatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-input bg-card p-6 sm:p-8 animate-pulse"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-40 mt-1" />
            </div>
            <Skeleton className="h-12 w-12 rounded-xl" variant="circular" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminIssueTableSkeleton({ rows = 6 }: { rows?: number } = {}) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
          <Skeleton className="h-10 w-10 rounded-lg" variant="circular" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-24 hidden md:block" variant="rectangular" />
          <Skeleton className="h-6 w-20 hidden lg:block" variant="rectangular" />
          <Skeleton className="h-6 w-20 hidden lg:block" variant="rectangular" />
          <Skeleton className="h-6 w-16" variant="rectangular" />
          <Skeleton className="h-4 w-20" variant="rectangular" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      ))}
    </div>
  );
}

export function AdminChartSkeleton() {
  return (
    <div className="rounded-2xl border border-input bg-card p-6 animate-pulse h-80">
      <Skeleton className="h-4 w-32 mb-6" />
      <div className="grid grid-cols-3 gap-4 h-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <Skeleton key={i} className="h-12 rounded-lg" variant="rectangular" />
        ))}
      </div>
    </div>
  );
}

export function AdminUserTableSkeleton({ rows = 6 }: { rows?: number } = {}) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
          <Skeleton className="h-10 w-10 rounded-full" variant="circular" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-6 w-24 hidden md:block" variant="rectangular" />
          <Skeleton className="h-6 w-24 hidden lg:block" variant="rectangular" />
          <Skeleton className="h-6 w-20" variant="rectangular" />
          <Skeleton className="h-6 w-24 hidden lg:block" variant="rectangular" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      ))}
    </div>
  );
}

export function AdminWelcomeHeaderSkeleton() {
  return (
    <div className="rounded-2xl border border-input bg-card p-6 sm:p-8 animate-pulse">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" variant="circular" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <Skeleton className="h-10 w-32" variant="rectangular" />
        <Skeleton className="h-10 w-32" variant="rectangular" />
        <Skeleton className="h-10 w-32" variant="rectangular" />
      </div>
    </div>
  );
}
