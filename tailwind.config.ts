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
          DEFAULT: "rgb(var(--rw-primary) / <alpha-value>)",
          hover: "rgb(var(--rw-primary-hover) / <alpha-value>)",
          light: "rgb(var(--rw-primary-light) / <alpha-value>)",
          text: "rgb(var(--rw-primary-text) / <alpha-value>)",
        },
        success: {
          DEFAULT: "rgb(var(--rw-success) / <alpha-value>)",
          light: "rgb(var(--rw-success-light) / <alpha-value>)",
          text: "rgb(var(--rw-success-text) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "rgb(var(--rw-warning) / <alpha-value>)",
          light: "rgb(var(--rw-warning-light) / <alpha-value>)",
          text: "rgb(var(--rw-warning-text) / <alpha-value>)",
        },
        danger: {
          DEFAULT: "rgb(var(--rw-danger) / <alpha-value>)",
          light: "rgb(var(--rw-danger-light) / <alpha-value>)",
          text: "rgb(var(--rw-danger-text) / <alpha-value>)",
        },
        cyan: "rgb(var(--rw-cyan) / <alpha-value>)",
        violet: "rgb(var(--rw-violet) / <alpha-value>)",
        sidebar: {
          DEFAULT: "rgb(var(--rw-sidebar) / <alpha-value>)",
          hover: "rgb(var(--rw-sidebar-hover) / <alpha-value>)",
          active: "rgb(var(--rw-sidebar-active) / <alpha-value>)",
        },
        page: "rgb(var(--rw-page) / <alpha-value>)",
        card: "rgb(var(--rw-card) / <alpha-value>)",
        border: {
          DEFAULT: "rgb(var(--rw-border) / <alpha-value>)",
          focus: "rgb(var(--rw-primary) / <alpha-value>)",
          hover: "rgb(var(--rw-border-hover) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--rw-ink) / <alpha-value>)",
          secondary: "rgb(var(--rw-ink-secondary) / <alpha-value>)",
          muted: "rgb(var(--rw-ink-muted) / <alpha-value>)",
          slate: "rgb(var(--rw-ink-slate) / <alpha-value>)",
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
        focus: "0 0 0 3px rgb(var(--rw-focus) / 1)",
        "focus-error": "0 0 0 3px rgb(var(--rw-danger-light) / 1)",
        lift: "0 12px 30px rgb(15 23 42 / 0.08)",
        cta: "0 8px 22px rgb(79 70 229 / 0.38)",
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
