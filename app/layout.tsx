import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SA Property & Visa Strategy",
  description: "Advanced property investment and visa tax calculator for South Australia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen selection:bg-emerald-200">
        {children}
      </body>
    </html>
  );
}