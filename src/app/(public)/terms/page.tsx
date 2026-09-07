import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="container-app py-12 max-w-3xl">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-brand-green mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
      
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Terms of Service</h1>
      <p className="text-text-muted mb-8">Last updated: August 2026</p>

      <div className="prose prose-brand max-w-none text-text-secondary">
        <p className="lead text-lg mb-6">
          Welcome to NutriFlow. By using our website and application, you agree to comply with and be bound by the following terms and conditions.
        </p>

        <h2 className="text-xl font-bold text-text-primary mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="mb-6">
          By accessing or using NutriFlow, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this application.
        </p>

        <h2 className="text-xl font-bold text-text-primary mt-8 mb-4">2. Description of Service</h2>
        <p className="mb-6">
          NutriFlow is a web-based meal planning application that provides recipe suggestions, pantry management, and grocery list organization based on user preferences. We reserve the right to modify, suspend, or discontinue the service at any time without notice.
        </p>

        <h2 className="text-xl font-bold text-text-primary mt-8 mb-4">3. User Accounts</h2>
        <p className="mb-4">
          When you create an account, you are responsible for maintaining the security of your account and password. You agree to:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Provide accurate and complete information.</li>
          <li>Keep your password secure.</li>
          <li>Notify us immediately of any unauthorized use of your account.</li>
        </ul>

        <h2 className="text-xl font-bold text-text-primary mt-8 mb-4">4. Intellectual Property</h2>
        <p className="mb-6">
          The application, including its original content, features, deterministic recommendation logic, and design, are owned by NutriFlow and are protected by international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express permission.
        </p>

        <h2 className="text-xl font-bold text-text-primary mt-8 mb-4">5. Disclaimer of Warranties</h2>
        <p className="mb-6">
          The service is provided on an "AS IS" and "AS AVAILABLE" basis. NutriFlow makes no warranties, expressed or implied, regarding the accuracy of nutritional information, recipe outcomes, or continuous availability of the service. Please see our <Link href="/disclaimer" className="text-brand-green hover:underline">Wellness Disclaimer</Link> for important health-related limitations.
        </p>

        <h2 className="text-xl font-bold text-text-primary mt-8 mb-4">6. Limitation of Liability</h2>
        <p className="mb-6">
          In no event shall NutriFlow or its creators be liable for any damages (including, without limitation, damages for loss of data or profit, or due to personal injury or health issues) arising out of the use or inability to use the application.
        </p>

        <h2 className="text-xl font-bold text-text-primary mt-8 mb-4">7. Changes to Terms</h2>
        <p className="mb-6">
          We may revise these Terms of Service at any time without notice. By using this application, you are agreeing to be bound by the then-current version of these Terms.
        </p>
      </div>
    </div>
  );
}
