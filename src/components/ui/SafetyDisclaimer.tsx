import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SafetyDisclaimerProps {
  className?: string;
  compact?: boolean;
}

export function SafetyDisclaimer({ className, compact = false }: SafetyDisclaimerProps) {
  if (compact) {
    return (
      <div className={cn("p-4 bg-surface-muted rounded-xl border border-border-muted flex items-start gap-3", className)}>
        <AlertTriangle className="w-5 h-5 text-status-warning shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-xs text-text-muted leading-relaxed">
          NutriFlow provides general food planning for everyday wellness. Not medical advice.{" "}
          <Link href="/disclaimer" className="text-brand-green hover:underline font-medium">
            Read our disclaimer
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className={cn("card p-5 bg-status-warning-bg border-status-warning/20", className)}>
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-5 h-5 text-status-warning" aria-hidden="true" />
        <h3 className="font-bold text-status-warning text-sm uppercase tracking-wide">
          Important Safety Notice
        </h3>
      </div>
      <div className="space-y-2 text-sm text-text-secondary leading-relaxed">
        <p>
          NutriFlow is a practical meal planning tool designed for general wellness and convenience. 
          <strong> It is not a medical device, nor does it provide medical advice, diagnosis, or treatment.</strong>
        </p>
        <p>
          All nutritional information provided is an estimate based on standard ingredient databases and 
          will vary based on portion sizes, ingredient brands, and cooking methods.
        </p>
        <p>
          If you have severe food allergies, medical conditions (such as diabetes or hypertension), or require 
          a therapeutic diet, you should consult with a qualified healthcare professional before relying on these suggestions.
        </p>
        <div className="mt-4">
          <Link href="/disclaimer" className="text-brand-green hover:underline font-medium inline-flex items-center gap-1">
            Read the full Wellness Disclaimer
          </Link>
        </div>
      </div>
    </div>
  );
}
