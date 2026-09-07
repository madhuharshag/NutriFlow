import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NutriFlow — Better food decisions, one meal at a time",
    template: "%s | NutriFlow",
  },
  description:
    "NutriFlow helps young Indians decide what practical meal to eat or cook next using their time, budget, ingredients, dietary preferences, and cooking confidence—without forcing calorie tracking.",
  keywords: [
    "Indian meal planner",
    "nutrition app India",
    "meal planning",
    "Indian recipes",
    "budget meals India",
    "healthy eating India",
    "vegetarian meals",
  ],
  authors: [{ name: "NutriFlow" }],
  creator: "NutriFlow",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "NutriFlow",
    title: "NutriFlow — Better food decisions, one meal at a time",
    description:
      "Practical Indian meal suggestions based on your time, budget, ingredients, and cooking confidence.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NutriFlow — Better food decisions, one meal at a time",
    description:
      "Practical Indian meal suggestions based on your time, budget, ingredients, and cooking confidence.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1F6B4F",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-brand-cream antialiased">
        {/* Skip navigation for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] btn-primary btn-md"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
