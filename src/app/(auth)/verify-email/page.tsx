"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Leaf, Loader2, CheckCircle, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

function VerifyEmailContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/onboarding";

  useEffect(() => {
    // In a real Supabase setup, the Auth Helpers handle exchanging the code in the hash
    // We just need to check if we have a session after the redirect
    const verifySession = async () => {
      try {
        const supabase = createClient();
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          setStatus("error");
        } else {
          setStatus("success");
          setTimeout(() => {
            router.push(next);
          }, 2000);
        }
      } catch {
        setStatus("error");
      }
    };

    verifySession();
  }, [next, router]);

  return (
    <div className="w-full max-w-md">
      <div className="card p-8 shadow-card-lg text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-brand-green flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <span className="font-bold text-xl text-text-primary">
            Nutri<span className="text-brand-green">Flow</span>
          </span>
        </div>

        {status === "loading" && (
          <div className="py-8">
            <Loader2 className="w-12 h-12 animate-spin text-brand-green mx-auto mb-4" />
            <h1 className="text-xl font-bold text-text-primary mb-2">Verifying your email</h1>
            <p className="text-sm text-text-muted">Please wait while we confirm your link...</p>
          </div>
        )}

        {status === "success" && (
          <div className="py-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-status-success-bg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-status-success" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold text-text-primary mb-2">Email Verified!</h1>
            <p className="text-sm text-text-muted mb-6">
              Your account is ready. Redirecting you to complete your setup...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="py-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-status-error-bg flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-status-error" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold text-text-primary mb-2">Verification Failed</h1>
            <p className="text-sm text-text-muted mb-6">
              The verification link is invalid or has expired. Please try logging in or signing up again.
            </p>
            <Link href="/login" className="btn-primary w-full block">
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-brand-green" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
