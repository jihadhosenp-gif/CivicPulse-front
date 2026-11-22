"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout, AuthCard, AuthInput } from "@/components/layout/auth-layout";
import { authService } from "@/services/auth";
import { toast } from "@/components/ui/use-toast";

export default function ResetPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      toast({
        title: "Invalid reset link",
        description: "This password reset link is missing or has expired.",
        variant: "danger",
      });
    }
  }, [token]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !token) return;
    setIsLoading(true);

    try {
      await authService.resetPassword({ token, password, confirmPassword });
      setIsSuccess(true);
      toast({
        title: "Password reset successful",
        description: "Your password has been updated. You can now sign in with your new password.",
        variant: "success",
      });
      // Redirect to login after a short delay
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || "Failed to reset password. Please try again.";
      toast({
        title: "Error",
        description: message,
        variant: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <AuthLayout
        title="Invalid reset link"
        description="This password reset link is missing or has expired. Please request a new one."
        actionText="Request new link"
        actionHref="/forgot-password"
      >
        <AuthCard>
          <div className="text-center">
            <Link href="/forgot-password" className="text-sm font-medium text-primary hover:text-primary/90">
              Request new reset link
            </Link>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={isSuccess ? "Password reset complete" : "Create new password"}
      description={isSuccess
        ? "Your password has been successfully updated."
        : "Enter your new password below. It must be at least 8 characters."}
      actionText={isSuccess ? "Sign in now" : "Back to sign in"}
      actionHref="/login"
    >
      <AuthCard>
        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-semibold text-foreground">
                New password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  aria-invalid={!!errors.password}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-danger">{errors.password}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground">
                Confirm new password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  aria-invalid={!!errors.confirmPassword}
                  autoComplete="new-password"
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-danger">{errors.confirmPassword}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset password"
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle className="h-6 w-6" />
            </div>
            <p className="text-sm text-muted-foreground">
              You can now sign in with your new password.
            </p>
            <Button className="w-full" onClick={() => router.push("/login")}>
              Sign in
            </Button>
          </div>
        )}
      </AuthCard>
    </AuthLayout>
  );
}