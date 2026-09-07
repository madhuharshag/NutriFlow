"use client";

import { useState } from "react";
import Link from "next/link";
import { Leaf, AlertCircle, Loader2, Check, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getAuthRedirect } from "@/lib/auth-redirect";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: getAuthRedirect("/reset-password"),
        }
      );
      // Always show success to prevent email enumeration
      if (authError) {
        console.error(authError);
      }
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="card p-8 shadow-card-lg">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-brand-green flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <span className="font-bold text-xl text-text-primary">
            Nutri<span className="text-brand-green">Flow</span>
          </span>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-status-success-bg flex items-center justify-center mx-auto mb-4">
              <Check
                className="w-7 h-7 text-status-success"
                aria-hidden="true"
              />
            </div>
            <h1 className="text-xl font-bold text-text-primary mb-2">
              Check your email
            </h1>
            <p className="text-sm text-text-muted mb-6">
              If an account exists for{" "}
              <strong className="text-text-secondary">{email}</strong>, we've
              sent password reset instructions.
            </p>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-sm text-brand-green hover:underline font-medium"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-text-primary mb-1.5">
                Reset your password
              </h1>
              <p className="text-sm text-text-muted">
                Enter your email and we'll send you a link to reset your
                password.
              </p>
            </div>

            {error && (
              <div
                className="flex items-start gap-2 bg-status-error-bg text-status-error rounded-xl p-3 mb-4 text-sm"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-5">
                <label htmlFor="email" className="label">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className={cn(
                  "btn-primary btn-lg w-full",
                  loading && "opacity-70"
                )}
                disabled={loading || !email}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                    Sending…
                  </>
                ) : (
                  "Send reset link"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-text-muted mt-5">
              Remembered it?{" "}
              <Link
                href="/login"
                className="text-brand-green font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
