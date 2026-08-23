import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Daleel \u2014 Anti-Muslim Hate Evidence Packager",
  description: "AI-Powered Islamophobic Content Analyzer & Evidence Packager. Built for The Harvest Hackathon 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-50 min-h-screen flex flex-col antialiased selection:bg-emerald-500/30`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
