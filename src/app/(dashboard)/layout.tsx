"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Utensils,
  ShoppingBasket,
  BookmarkCheck,
  ShoppingCart,
  User,
  Leaf,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/plan", label: "Plan", icon: Utensils },
  { href: "/pantry", label: "Pantry", icon: ShoppingBasket },
  { href: "/saved", label: "Saved", icon: BookmarkCheck },
  { href: "/grocery-list", label: "Grocery", icon: ShoppingCart },
];

function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-white border-r border-border-muted fixed left-0 top-0 bottom-0 z-30">
      {/* Logo */}
      <div className="p-5 border-b border-border-muted">
        <Link href="/home" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-green flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
          <span className="font-bold text-lg text-text-primary">
            Nutri<span className="text-brand-green">Flow</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3" aria-label="Dashboard navigation">
        <ul className="flex flex-col gap-1" role="list">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-status-success-bg text-brand-green"
                      : "text-text-muted hover:bg-surface-muted hover:text-text-primary"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-border-muted flex flex-col gap-1">
        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
            pathname.startsWith("/profile")
              ? "bg-status-success-bg text-brand-green"
              : "text-text-muted hover:bg-surface-muted hover:text-text-primary"
          )}
        >
          <User className="w-4 h-4" aria-hidden="true" />
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:bg-surface-muted hover:text-status-error transition-all text-left"
          aria-label="Log out of NutriFlow"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
          Log out
        </button>
      </div>
    </aside>
  );
}

function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="bottom-nav"
      aria-label="Mobile bottom navigation"
    >
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn("bottom-nav-item", isActive && "active")}
            aria-current={isActive ? "page" : undefined}
          >
            <item.icon className="w-5 h-5" aria-hidden="true" />
            <span className="text-2xs font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-brand-cream">
      <DashboardSidebar />
      <div className="flex-1 md:ml-60 pb-20 md:pb-0">
        <main id="main-content">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
