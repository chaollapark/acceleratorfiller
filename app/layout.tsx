import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Apply to 32 Accelerators with One YC Application",
  description: "Pay €50, upload your YC application, receive materials adapted for 32 accelerators together."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Animated background gradients */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100/20 via-transparent to-transparent animate-pulse" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-purple-100/10 via-transparent to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
} 