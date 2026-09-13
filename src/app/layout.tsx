import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RouteFlow | Jaipur Wholesale Distribution Management",
  description:
    "Warehouse-to-retailer wholesale distribution management system for Jaipur Wholesale Distributors, Rajasthan.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-100 text-slate-900 selection:bg-blue-900 selection:text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
