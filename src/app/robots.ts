import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/contact", "/disclaimer", "/privacy-policy", "/terms"],
        disallow: ["/api/", "/home", "/pantry", "/plan", "/profile", "/recommendations", "/saved", "/grocery-list", "/onboarding"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
