"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Leaf, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getAuthRedirect } from "@/lib/auth-redirect";
import { cn } from "@/lib/utils";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/home";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        // Generic message — don't reveal if email exists
        setError(
          "We couldn't sign you in. Please check your email and password."
        );
        return;
      }

      router.push(next);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    if (googleLoading) return;
    setError(null);
    setGoogleLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getAuthRedirect(`/auth/callback?next=${encodeURIComponent(next)}`),
        },
      });
      if (authError) {
        setError("Google sign-in is not available right now. Please use email sign-in.");
        setGoogleLoading(false);
      }
    } catch {
      setError("Google sign-in is not available right now. Please use email sign-in.");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Card */}
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

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary mb-1.5">
            Welcome back to NutriFlow
          </h1>
          <p className="text-sm text-text-muted">
            Your next practical meal is just a few choices away.
          </p>
        </div>

        {/* Google sign-in */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-border rounded-xl py-3 px-4 text-sm font-semibold text-text-secondary hover:bg-surface-muted hover:border-border-strong transition-all mb-5"
          type="button"
          disabled={loading || googleLoading}
          aria-label="Continue with Google"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        <div className="relative mb-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-muted" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-text-muted">
              or continue with email
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="flex items-start gap-2 bg-status-error-bg text-status-error rounded-xl p-3 mb-4 text-sm"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle
              className="w-4 h-4 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} noValidate>
          <div className="mb-4">
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
              aria-required="true"
              disabled={loading}
            />
          </div>

          <div className="mb-2">
            <label htmlFor="password" className="label">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="input pr-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                aria-required="true"
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors p-1 rounded"
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
          </div>

          <div className="flex justify-end mb-5">
            <Link
              href="/forgot-password"
              className="text-xs text-brand-green hover:underline font-medium"
            >
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            className={cn("btn-primary btn-lg w-full", loading && "opacity-70")}
            disabled={loading || googleLoading || !email || !password}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-5">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-brand-green font-semibold hover:underline"
          >
            Start for free
          </Link>
        </p>

        <p className="text-center text-xs text-text-placeholder mt-4">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="hover:text-brand-green underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            className="hover:text-brand-green underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-brand-green" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
