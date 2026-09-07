"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#why-different", label: "Why NutriFlow" },
  { href: "/login", label: "Log in" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-card border-b border-border-muted"
          : "bg-transparent"
      )}
      role="banner"
    >
      <div className="container-app">
        <nav
          className="flex items-center justify-between h-16 md:h-18"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="NutriFlow home"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-green flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Leaf className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <span className="font-bold text-xl text-text-primary tracking-tight">
              Nutri<span className="text-brand-green">Flow</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8" role="list">
            {navLinks.slice(0, 2).map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-text-secondary hover:text-brand-green transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-text-secondary hover:text-brand-green transition-colors"
            >
              Log in
            </Link>
            <Link href="/signup" className="btn-primary btn-md">
              Get started free
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-xl text-text-secondary hover:bg-surface-muted transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </nav>

        {/* Mobile menu */}
        {isOpen && (
          <div
            id="mobile-menu"
            className="md:hidden border-t border-border-muted bg-white/98 backdrop-blur-md"
            role="dialog"
            aria-label="Mobile navigation"
          >
            <ul className="flex flex-col py-4 gap-1" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-4 py-3 text-sm font-medium text-text-secondary hover:text-brand-green hover:bg-surface-muted rounded-xl transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="px-4 pt-2">
                <Link
                  href="/signup"
                  className="btn-primary btn-lg w-full"
                  onClick={() => setIsOpen(false)}
                >
                  Plan my next meal →
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
