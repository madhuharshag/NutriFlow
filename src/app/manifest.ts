import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NutriFlow — Better food decisions, one meal at a time",
    short_name: "NutriFlow",
    description:
      "Practical Indian meal planning based on your time, budget, ingredients, dietary preferences, and cooking confidence.",
    start_url: "/home",
    display: "standalone",
    background_color: "#FAF8F4",
    theme_color: "#1F6B4F",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
