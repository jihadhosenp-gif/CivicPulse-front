'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { SubmitReportForm } from '@/components/report/submit-report-form';

export default function NewReportPage() {
  return (
    <div className="mx-auto w-full max-w-3xl py-2">
      {/* Breadcrumb / back */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      {/* Page header */}
      <div className="mt-4 mb-8">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          AI-assisted review
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Report a civic issue
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Spot a problem in your neighbourhood? Let us know and we&apos;ll route
          it to the right team. Fields marked <span className="text-danger">*</span> are required.
        </p>
      </div>

      <SubmitReportForm />
    </div>
  );
}