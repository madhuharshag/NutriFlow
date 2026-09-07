"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Eye, EyeOff, AlertCircle, Loader2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const passwordStrong = password.length >= 8;

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    if (!passwordStrong) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.updateUser({
        password: password
      });

      if (authError) {
        setError("Your password reset link may have expired. Please try requesting a new one.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/home");
      }, 3000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="card p-8 shadow-card-lg text-center">
          <div className="w-14 h-14 rounded-full bg-status-success-bg flex items-center justify-center mx-auto mb-4">
            <Check className="w-7 h-7 text-status-success" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-bold text-text-primary mb-2">
            Password Reset Successful
          </h1>
          <p className="text-sm text-text-muted mb-6">
            Your password has been securely updated. Redirecting you to the dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="card p-8 shadow-card-lg">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-brand-green flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <span className="font-bold text-xl text-text-primary">
            Nutri<span className="text-brand-green">Flow</span>
          </span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary mb-1.5">
            Create new password
          </h1>
          <p className="text-sm text-text-muted">
            Enter a strong new password for your account.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-status-error-bg text-status-error rounded-xl p-3 mb-4 text-sm" role="alert">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            {error}
          </div>
        )}

        <form onSubmit={handleReset} noValidate>
          <div className="mb-6">
            <label htmlFor="password" className="label">
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className={cn("input pr-11", password && !passwordStrong && "input-error")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary p-1 rounded"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Eye className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {password && !passwordStrong && (
              <p className="error-message" role="alert">
                Password must be at least 8 characters.
              </p>
            )}
          </div>

          <button
            type="submit"
            className={cn("btn-primary btn-lg w-full", loading && "opacity-70")}
            disabled={loading || !password}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                Updating…
              </>
            ) : (
              "Update password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
