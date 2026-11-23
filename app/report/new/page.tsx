'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { SubmitReportForm } from '@/components/report/submit-report-form';

const headerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function NewReportPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-0 py-4 sm:py-6">
      {/* Back link */}
      <motion.div variants={headerVariants} initial="hidden" animate="visible">
        <Link
          href="/dashboard"
          className="group inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to dashboard
        </Link>
      </motion.div>

      {/* Page header */}
      <motion.header
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.05 }}
        className="mt-4 mb-6 sm:mb-8"
      >
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          AI-assisted review
        </div>

        <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Report a civic issue
        </h1>
        <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          Spot a problem in your neighbourhood? Share the details and we&apos;ll
          route it to the right response team. Fields marked{' '}
          <span className="font-semibold text-danger">*</span> are required.
        </p>

        {/* Trust signals */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-success" />
            Reviewed by the city response team
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary" />
            Takes about 2 minutes
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-primary" />
            Pin an exact location
          </span>
        </div>
      </motion.header>

      <SubmitReportForm />
    </div>
  );
}