import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="container-app py-12 max-w-3xl">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-brand-green mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
      
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Privacy Policy</h1>
      <p className="text-text-muted mb-8">Last updated: August 2026</p>

      <div className="prose prose-brand max-w-none text-text-secondary">
        <p className="lead text-lg mb-6">
          At NutriFlow, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information when you use our meal planning application.
        </p>

        <h2 className="text-xl font-bold text-text-primary mt-8 mb-4">1. Information We Collect</h2>
        <p className="mb-4">We collect information that you provide directly to us when setting up your account and using the service:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Account Information:</strong> Email address and password (securely hashed via Supabase).</li>
          <li><strong>Dietary Preferences:</strong> Information about your diet type, allergies, and ingredient dislikes.</li>
          <li><strong>Usage Data:</strong> Meals you save, pantry items you track, and feedback you provide on recommendations.</li>
        </ul>

        <h2 className="text-xl font-bold text-text-primary mt-8 mb-4">2. How We Use Your Information</h2>
        <p className="mb-4">Your data is strictly used to power the core functionality of NutriFlow:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>To operate the deterministic recommendation engine and suggest safe, relevant meals.</li>
          <li>To maintain your pantry state, grocery lists, and saved meals.</li>
          <li>To improve the quality of our recipes and application performance (via aggregated, anonymous analytics).</li>
        </ul>

        <h2 className="text-xl font-bold text-text-primary mt-8 mb-4">3. Data Sharing and Protection</h2>
        <p className="mb-4">
          <strong>We do not sell your personal data to third parties.</strong>
        </p>
        <p className="mb-6">
          Your data is stored securely using industry-standard cloud providers (Supabase/Neon). We use row-level security (RLS) policies to ensure that your personal data is only accessible to your authenticated account.
        </p>

        <h2 className="text-xl font-bold text-text-primary mt-8 mb-4">4. Your Data Rights</h2>
        <p className="mb-4">You have complete control over your data. You have the right to:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Access the personal data we hold about you.</li>
          <li>Request an export of your data in a portable format.</li>
          <li>Delete your account and all associated personal data permanently from our systems.</li>
        </ul>

        <h2 className="text-xl font-bold text-text-primary mt-8 mb-4">5. Third-Party Analytics</h2>
        <p className="mb-6">
          We may use privacy-first analytics tools (like PostHog) to understand how the app is used. These tools are configured to not capture sensitive personal identifiers or specific keystrokes.
        </p>

        <h2 className="text-xl font-bold text-text-primary mt-8 mb-4">6. Contact Us</h2>
        <p className="mb-6">
          If you have questions about this Privacy Policy, please contact us via the <Link href="/contact" className="text-brand-green hover:underline">Contact page</Link>.
        </p>
      </div>
    </div>
  );
}
