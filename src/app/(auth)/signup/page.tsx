"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, Eye, EyeOff, AlertCircle, Loader2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getAuthRedirect } from "@/lib/auth-redirect";
import { cn } from "@/lib/utils";

const DIETARY_OPTIONS = [
  { value: "VEGETARIAN", label: "Vegetarian" },
  { value: "EGGETARIAN", label: "Eggetarian" },
  { value: "NON_VEGETARIAN", label: "Non-vegetarian" },
  { value: "VEGAN", label: "Vegan" },
  { value: "JAIN_FRIENDLY", label: "Jain-friendly" },
];

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [diet, setDiet] = useState("VEGETARIAN");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const passwordStrong = password.length >= 8;

  async function handleSignup(e: React.FormEvent) {
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
      const { error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: getAuthRedirect("/auth/callback?next=/onboarding"),
          data: { dietary_pattern: diet },
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          setError(
            "An account with this email already exists. Try signing in."
          );
        } else {
          setError("Something went wrong. Please try again.");
        }
        return;
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    if (googleLoading) return;
    setError(null);
    setGoogleLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getAuthRedirect("/auth/callback?next=/onboarding"),
        },
      });
      if (authError) {
        setError("Google sign-up is not available right now. Please use email sign-up.");
        setGoogleLoading(false);
      }
    } catch {
      setError("Google sign-up is not available right now. Please use email sign-up.");
      setGoogleLoading(false);
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="card p-8 shadow-card-lg text-center">
          <div className="w-14 h-14 rounded-full bg-status-success-bg flex items-center justify-center mx-auto mb-4">
            <Check
              className="w-7 h-7 text-status-success"
              aria-hidden="true"
            />
          </div>
          <h1 className="text-xl font-bold text-text-primary mb-2">
            Check your email!
          </h1>
          <p className="text-sm text-text-muted mb-6">
            We've sent a verification link to{" "}
            <strong className="text-text-secondary">{email}</strong>. Click the
            link to activate your NutriFlow account.
          </p>
          <p className="text-xs text-text-placeholder">
            Didn't get the email? Check your spam folder or{" "}
            <button
              onClick={() => setSuccess(false)}
              className="text-brand-green hover:underline"
            >
              try again
            </button>
            .
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
            Start your NutriFlow journey
          </h1>
          <p className="text-sm text-text-muted">
            Tell us what works for your routine, and NutriFlow will help you
            find practical meal options.
          </p>
        </div>

        {/* Google sign-up */}
        <button
          onClick={handleGoogleSignup}
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
              or create with email
            </span>
          </div>
        </div>

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

        <form onSubmit={handleSignup} noValidate>
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
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="label">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className={cn(
                  "input pr-11",
                  password && !passwordStrong && "input-error"
                )}
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

          {/* Quick dietary preference */}
          <div className="mb-5">
            <label className="label" id="diet-label">
              Dietary preference{" "}
              <span className="font-normal text-text-muted">(quick pick)</span>
            </label>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-labelledby="diet-label"
            >
              {DIETARY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={cn(
                    "chip",
                    diet === opt.value && "chip-selected"
                  )}
                  onClick={() => setDiet(opt.value)}
                  aria-pressed={diet === opt.value}
                >
                  {diet === opt.value && (
                    <Check className="w-3 h-3" aria-hidden="true" />
                  )}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className={cn(
              "btn-primary btn-lg w-full",
              loading && "opacity-70"
            )}
            disabled={loading || googleLoading || !email || !password}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <Loader2
                  className="w-4 h-4 animate-spin"
                  aria-hidden="true"
                />
                Creating account…
              </>
            ) : (
              "Create my account"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-5">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-brand-green font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>

        <p className="text-center text-xs text-text-placeholder mt-4 leading-relaxed">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="hover:text-brand-green underline">
            Terms
          </Link>
          ,{" "}
          <Link
            href="/privacy-policy"
            className="hover:text-brand-green underline"
          >
            Privacy Policy
          </Link>
          , and our{" "}
          <Link
            href="/disclaimer"
            className="hover:text-brand-green underline"
          >
            Wellness Disclaimer
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
