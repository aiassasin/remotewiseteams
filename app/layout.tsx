import type { Metadata } from "next";
import { cookies } from "next/headers";
import { IBM_Plex_Sans_Arabic, Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { LanguageProvider } from "@/components/i18n/language-provider";
import { ThemeScript } from "@/components/theme/theme-script";
import { LanguageScript } from "@/components/i18n/language-script";
import { CookieBanner } from "@/components/legal/cookie-banner";
import { AnalyticsGate } from "@/components/observability/analytics-gate";
import { SkipToContent } from "@/components/i18n/skip-to-content";
import { APP_LANGUAGE_COOKIE, isRtlLanguage, normalizeAppLanguage } from "@/lib/i18n";
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

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  weight: ["400", "500", "600", "700"],
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
  const cookieLang = cookies().get(APP_LANGUAGE_COOKIE)?.value;
  const initialLanguage = normalizeAppLanguage(cookieLang);

  return (
    <html
      lang={initialLanguage}
      dir={isRtlLanguage(initialLanguage) ? "rtl" : "ltr"}
      className={`${display.variable} ${sans.variable} ${arabic.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <LanguageScript />
      </head>
      <body className="min-h-screen bg-page font-sans antialiased">
        <ThemeProvider>
          <LanguageProvider initialLanguage={initialLanguage}>
            <SkipToContent />
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
