import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Apply to 32 Accelerators with One YC-style Application",
  description: "Pay €50, upload your YC application, receive materials adapted for 32 accelerators together."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100 via-transparent to-transparent" />
        {children}
      </body>
    </html>
  );
} 