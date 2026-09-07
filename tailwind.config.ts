import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // NutriFlow Brand Palette
        brand: {
          green: "#1F6B4F",
          "green-light": "#2E8B57",
          "green-dark": "#155240",
          turmeric: "#E6A63B",
          "turmeric-light": "#F0BC5E",
          "turmeric-dark": "#C98218",
          cream: "#FAF8F2",
          "cream-dark": "#F0EDE4",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F8F9FA",
          subtle: "#FAF8F2",
        },
        text: {
          primary: "#1E2933",
          secondary: "#3D4F5C",
          muted: "#5D6872",
          placeholder: "#8E9AA3",
          inverse: "#FFFFFF",
        },
        status: {
          success: "#2E8B57",
          "success-bg": "#E8F5ED",
          warning: "#C98218",
          "warning-bg": "#FEF3DC",
          error: "#B42318",
          "error-bg": "#FEE4E2",
          info: "#1D4ED8",
          "info-bg": "#EFF6FF",
        },
        border: {
          DEFAULT: "#E5E9ED",
          muted: "#F0F2F5",
          strong: "#C5CDD5",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        heading: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "88": "22rem",
        "120": "30rem",
        "144": "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover":
          "0 8px 25px rgba(0,0,0,0.10), 0 3px 10px rgba(0,0,0,0.06)",
        "card-lg": "0 4px 20px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
        glow: "0 0 0 3px rgba(31, 107, 79, 0.2)",
        "glow-turmeric": "0 0 0 3px rgba(230, 166, 59, 0.25)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "slide-up": "slideUp 0.4s ease-out forwards",
        "slide-in-right": "slideInRight 0.3s ease-out forwards",
        shimmer: "shimmer 1.8s infinite linear",
        "pulse-soft": "pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-gentle": "bounceGentle 1s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, #1F6B4F 0%, #2E8B57 50%, #1F6B4F 100%)",
        "gradient-turmeric":
          "linear-gradient(135deg, #E6A63B 0%, #F0BC5E 100%)",
        "gradient-hero":
          "linear-gradient(160deg, #F5F2EA 0%, #FAF8F2 50%, #EFF7F2 100%)",
        "gradient-card": "linear-gradient(145deg, #FFFFFF 0%, #F8FAF9 100%)",
        shimmer:
          "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
};

export default config;
