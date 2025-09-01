import "./globals.css";
import { ReactNode } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { PHProvider } from "./providers/posthog";

export const metadata: Metadata = {
  title: "Apply to 32 Accelerators with One YC Application",
  description:
    "Pay €99, upload your YC application, receive materials adapted for 32 accelerators together.",
  icons: {
    icon: [
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicons/favicon.ico" }
    ],
    apple: [
      { url: "/favicons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    shortcut: ["/favicons/favicon.ico"]
  },
  manifest: "/site.webmanifest"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Animated background gradients */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100/20 via-transparent to-transparent animate-pulse" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-purple-100/10 via-transparent to-transparent" />
        
        {/* Ahrefs Analytics */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="YI5GEkOmnWdAtFNrWsbTBw"
          strategy="afterInteractive"
        />
        
        {/* Content */}
        <div className="relative z-10 min-h-screen">
          <PHProvider>
            {children}
          </PHProvider>
        </div>
      </body>
    </html>
  );
}
 