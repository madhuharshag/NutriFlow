import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 bg-surface-muted rounded-full flex items-center justify-center mb-6">
        <FileQuestion className="w-10 h-10 text-text-muted" aria-hidden="true" />
      </div>
      <h1 className="text-4xl font-bold text-text-primary mb-2">404</h1>
      <h2 className="text-xl font-semibold text-text-secondary mb-4">Page not found</h2>
      <p className="text-text-muted max-w-md mb-8">
        We couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
      </p>
      <Link href="/home" className="btn-primary flex items-center gap-2">
        <Home className="w-4 h-4" />
        Return Home
      </Link>
    </div>
  );
}
