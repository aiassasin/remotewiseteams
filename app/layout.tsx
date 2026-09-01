import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { LanguageProvider } from "@/components/i18n/language-provider";
import { ThemeScript } from "@/components/theme/theme-script";
import { CookieBanner } from "@/components/legal/cookie-banner";
import { AnalyticsGate } from "@/components/observability/analytics-gate";
import { pageMeta } from "@/lib/seo";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  ...pageMeta("RemoteWise Teams"),
  title: {
    default: "RemoteWise Teams",
    template: "%s · RemoteWise Teams",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen bg-page font-sans antialiased">
        <ThemeProvider>
          <LanguageProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-card focus:px-3 focus:py-2 focus:text-ink focus:shadow-focus"
            >
              Skip to content
            </a>
            {children}
            <Toaster />
            <CookieBanner />
            <AnalyticsGate />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
