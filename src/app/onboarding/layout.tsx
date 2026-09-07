import { Leaf } from "lucide-react";
import Link from "next/link";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-cream flex flex-col">
      {/* Simple header without navigation */}
      <header className="h-16 border-b border-border-muted bg-white flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-green flex items-center justify-center shadow-sm">
            <Leaf className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
          <span className="font-bold text-xl text-text-primary tracking-tight">
            Nutri<span className="text-brand-green">Flow</span>
          </span>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto pb-safe">
        {children}
      </main>
    </div>
  );
}
