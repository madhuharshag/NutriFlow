"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, 
  Settings, 
  Shield, 
  CreditCard, 
  LogOut, 
  ChevronRight,
  Bell,
  Utensils
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [mockUser, setMockUser] = useState({
    email: "user@example.com",
    diet: "Vegetarian",
    joinDate: "August 2026"
  });

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setMockUser({
            email: data.user.email || "user@example.com",
            diet: data.user.preference?.dietaryPattern || "Vegetarian",
            joinDate: new Date(data.user.createdAt || Date.now()).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            }),
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="container-app py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="page-title">Profile & Settings</h1>
      </div>

      {/* Profile Card */}
      <div className="card p-6 mb-8 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-brand-green flex items-center justify-center shadow-sm">
          <User className="w-8 h-8 text-white" aria-hidden />
        </div>
        <div>
          <h2 className="font-bold text-lg text-text-primary">Your Account</h2>
          <p className="text-sm text-text-muted">{mockUser.email}</p>
          <div className="mt-2 inline-flex items-center gap-1.5 bg-status-success-bg text-brand-green px-2 py-1 rounded-md text-xs font-medium border border-brand-green/20">
            <Utensils className="w-3 h-3" />
            {mockUser.diet}
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="flex flex-col gap-6">
        
        {/* Section 1: Preferences */}
        <section>
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3 px-1">
            Preferences
          </h3>
          <div className="card overflow-hidden">
            <ul className="flex flex-col">
              <Link href="/onboarding" className="flex items-center justify-between p-4 border-b border-border-muted hover:bg-surface-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center">
                    <Utensils className="w-4 h-4 text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Dietary Preferences</p>
                    <p className="text-xs text-text-muted">Update diet, allergies, and dislikes</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-text-placeholder" />
              </Link>
              <button className="flex items-center justify-between p-4 hover:bg-surface-muted transition-colors text-left w-full">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center">
                    <Bell className="w-4 h-4 text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Notifications</p>
                    <p className="text-xs text-text-muted">Manage email and app alerts</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-text-placeholder" />
              </button>
            </ul>
          </div>
        </section>

        {/* Section 2: Account */}
        <section>
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3 px-1">
            Account & Security
          </h3>
          <div className="card overflow-hidden">
            <ul className="flex flex-col">
              <Link href="/privacy-policy" className="flex items-center justify-between p-4 border-b border-border-muted hover:bg-surface-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center">
                    <Shield className="w-4 h-4 text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Privacy & Data</p>
                    <p className="text-xs text-text-muted">Export data or delete account</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-text-placeholder" />
              </Link>
              <button className="flex items-center justify-between p-4 hover:bg-surface-muted transition-colors text-left w-full">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Subscription</p>
                    <p className="text-xs text-text-muted">NutriFlow is currently free to use</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-text-placeholder" />
              </button>
            </ul>
          </div>
        </section>
      </div>

      {/* Logout */}
      <div className="mt-8 pt-6 border-t border-border-muted text-center">
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="inline-flex items-center gap-2 text-sm font-medium text-status-error hover:text-red-700 bg-status-error-bg hover:bg-red-100 px-6 py-3 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {isLoggingOut ? "Logging out..." : "Log out"}
        </button>
        <p className="mt-4 text-xs text-text-placeholder">
          NutriFlow v0.1.0 · Joined {mockUser.joinDate}
        </p>
      </div>
    </div>
  );
}
