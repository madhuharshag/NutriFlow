import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container-app py-12 max-w-2xl">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-brand-green mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
      
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Contact Us</h1>
      <p className="text-text-muted mb-8">
        Have questions, feedback, or need help? We'd love to hear from you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="card p-6 flex flex-col items-start border border-border-muted hover:border-brand-green/30 transition-colors">
          <div className="w-12 h-12 rounded-full bg-status-info-bg flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-status-info" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-text-primary mb-2">Email Support</h2>
          <p className="text-sm text-text-muted mb-4 flex-1">
            For account issues, data export requests, or general inquiries.
          </p>
          <a href="mailto:support@nutriflow.example.com" className="text-brand-green font-medium hover:underline text-sm">
            support@nutriflow.example.com
          </a>
        </div>

        <div className="card p-6 flex flex-col items-start border border-border-muted hover:border-brand-green/30 transition-colors">
          <div className="w-12 h-12 rounded-full bg-status-success-bg flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6 text-status-success" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-text-primary mb-2">Feedback</h2>
          <p className="text-sm text-text-muted mb-4 flex-1">
            Have an idea for a new feature or found a bug? Let us know.
          </p>
          <Link href="/feedback" className="text-brand-green font-medium hover:underline text-sm">
            Submit Feedback
          </Link>
        </div>
      </div>
      
      <div className="card p-8 bg-surface-muted border-none text-center">
        <h2 className="text-xl font-bold text-text-primary mb-2">Data Privacy Requests</h2>
        <p className="text-sm text-text-muted mb-6 max-w-md mx-auto">
          If you wish to export your personal data or permanently delete your account in accordance with privacy laws, please email us directly with the subject line "Data Request".
        </p>
        <a href="mailto:privacy@nutriflow.example.com?subject=Data Request" className="btn-secondary btn-md inline-flex">
          Contact Privacy Team
        </a>
      </div>
    </div>
  );
}
