import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          hover: "#4338CA",
          light: "#EEF2FF",
          text: "#3730A3",
        },
        success: {
          DEFAULT: "#10B981",
          light: "#ECFDF5",
          text: "#065F46",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FFFBEB",
          text: "#92400E",
        },
        danger: {
          DEFAULT: "#F43F5E",
          light: "#FFF1F2",
          text: "#9F1239",
        },
        sidebar: {
          DEFAULT: "#0F172A",
          hover: "#1E293B",
          active: "#1E293B",
        },
        page: "#F8FAFC",
        card: "#FFFFFF",
        border: {
          DEFAULT: "#E2E8F0",
          focus: "#4F46E5",
          hover: "#CBD5E1",
        },
        ink: {
          DEFAULT: "#0F172A",
          secondary: "#475569",
          muted: "#94A3B8",
          slate: "#64748B",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        display: ["32px", { lineHeight: "1.2", fontWeight: "600", letterSpacing: "-0.5px" }],
        section: ["20px", { lineHeight: "1.3", fontWeight: "600", letterSpacing: "-0.3px" }],
        card: ["16px", { lineHeight: "1.4", fontWeight: "600", letterSpacing: "0" }],
        body: ["14px", { lineHeight: "1.6", fontWeight: "400" }],
        small: ["12px", { lineHeight: "1.4", fontWeight: "400" }],
        mono: ["13px", { lineHeight: "1.5", fontWeight: "400" }],
      },
      borderRadius: {
        card: "12px",
        control: "8px",
        pill: "100px",
      },
      boxShadow: {
        focus: "0 0 0 3px #EEF2FF",
        "focus-error": "0 0 0 3px #FFF1F2",
      },
      maxWidth: {
        content: "1200px",
        empty: "400px",
        modal: "480px",
      },
      keyframes: {
        "spinner-rotate": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        spinner: "spinner-rotate 0.7s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
