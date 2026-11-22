"use client";

import * as React from "react";
import { Suspense } from "react";
import ResetPasswordPageContent from './reset-password-content';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}