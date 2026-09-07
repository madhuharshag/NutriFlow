import Link from "next/link";
import { Leaf, Heart } from "lucide-react";

const footerLinks = {
  product: [
    { href: "/#how-it-works", label: "How it works" },
    { href: "/#why-different", label: "Why NutriFlow" },
    { href: "/signup", label: "Get started" },
  ],
  company: [
    { href: "/contact", label: "Contact us" },
    { href: "/about", label: "About" },
  ],
  legal: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/disclaimer", label: "Wellness Disclaimer" },
  ],
};

export function Footer() {
  return (
    <footer
      className="bg-text-primary text-white"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Safety disclaimer */}
      <div className="border-b border-white/10">
        <div className="container-app py-5">
          <p className="text-xs text-white/60 text-center max-w-3xl mx-auto leading-relaxed">
            <strong className="text-white/80">Wellness Note:</strong>{" "}
            NutriFlow provides general food planning and nutrition education for
            everyday wellness. It is not medical advice, diagnosis, or
            treatment. Consult a qualified healthcare professional for medical
            conditions, pregnancy, breastfeeding, serious allergies, or
            individualized therapeutic diet needs.
          </p>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-app py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-brand-green flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <span className="font-bold text-xl">
                Nutri<span className="text-brand-turmeric">Flow</span>
              </span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              Better food decisions, one meal at a time.
            </p>
            <p className="text-xs text-white/40">
              Made with{" "}
              <Heart className="inline w-3 h-3 text-brand-turmeric" /> for
              young India
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white/90 mb-4 tracking-wide uppercase">
              Product
            </h3>
            <ul className="flex flex-col gap-2.5" role="list">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white/90 mb-4 tracking-wide uppercase">
              Company
            </h3>
            <ul className="flex flex-col gap-2.5" role="list">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white/90 mb-4 tracking-wide uppercase">
              Legal
            </h3>
            <ul className="flex flex-col gap-2.5" role="list">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} NutriFlow. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Built for everyday Indian eating
          </p>
        </div>
      </div>
    </footer>
  );
}
