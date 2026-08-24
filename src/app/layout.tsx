import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ProfileCompletionModal from "@/components/ProfileCompletionModal";
import FactCheckBot from "@/components/FactCheckBot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Daleel - Trust & Safety Pipeline",
  description: "Islamophobic Content Analyzer & Evidence Packager. Built for The Harvest Hackathon 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-50 min-h-screen flex flex-col antialiased selection:bg-emerald-500/30`}>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme');
                if (theme === 'light' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches)) {
                  document.documentElement.classList.add('light-mode');
                }
              } catch (e) {}
            })();
          `
        }} />
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" async></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({pageLanguage: 'en', autoDisplay: false}, 'google_translate_element');
            }
          `
        }} />
        <AuthProvider>
          <ProfileCompletionModal />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
