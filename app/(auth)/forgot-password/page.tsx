"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { Mail, Eye, EyeOff, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout, AuthCard, AuthInput } from "@/components/layout/auth-layout";
import { authService } from "@/services/auth";
import { toast } from "@/components/ui/use-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email address";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    try {
      await authService.forgotPassword({ email });
      setIsSubmitted(true);
      toast({
        title: "Email sent",
        description: "If an account exists, you'll receive password reset instructions.",
        variant: "success",
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || "Failed to send reset email. Please try again.";
      toast({
        title: "Error",
        description: message,
        variant: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!validate()) return;
    setIsLoading(true);

    try {
      await authService.forgotPassword({ email });
      toast({
        title: "Email resent",
        description: "Password reset instructions have been sent again.",
        variant: "success",
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || "Failed to resend email. Please try again.";
      toast({
        title: "Error",
        description: message,
        variant: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={isSubmitted ? "Check your email" : "Forgot password?"}
      description={isSubmitted
        ? "We've sent password reset instructions to your email address."
        : "Enter your email and we'll send you a link to reset your password"}
      actionText="Remember your password?"
      actionHref="/login"
    >
      <AuthCard>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput
              label="Email address"
              id="email"
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="h-4 w-4" />}
              error={errors.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
              <RotateCcw className="h-6 w-6" />
            </div>
            <p className="text-sm text-muted-foreground">
              Please check your inbox (and spam folder) for the reset link.
              The link will expire in 1 hour.
            </p>

            <Button variant="outline" className="w-full" onClick={handleResend} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resending...
                </>
              ) : (
                "Resend email"
              )}
            </Button>

            <Link href="/login" className="text-sm font-medium text-primary hover:text-primary/90">
              Back to sign in
            </Link>
          </div>
        )}
      </AuthCard>
    </AuthLayout>
  );
}