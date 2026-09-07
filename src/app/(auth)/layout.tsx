export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Background decoration */}
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-green/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-brand-turmeric/8 blur-3xl" />
      </div>
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        {children}
      </main>
      <footer className="relative z-10 py-4 text-center">
        <p className="text-xs text-text-muted">
          NutriFlow provides general food planning for wellness — not medical
          advice.{" "}
          <a href="/disclaimer" className="underline hover:text-brand-green">
            Wellness disclaimer
          </a>
        </p>
      </footer>
    </div>
  );
}
