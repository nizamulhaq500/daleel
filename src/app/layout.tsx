import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { AuthProvider } from "@/contexts/AuthContext";
import ProfileCompletionModal from "@/components/ProfileCompletionModal";
import FactCheckBot from "@/components/FactCheckBot";
import DynamicBackground from "@/components/DynamicBackground";
import CommandPalette from "@/components/CommandPalette";

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
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans bg-transparent text-slate-50 min-h-screen flex flex-col antialiased selection:bg-emerald-500/30 relative" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('desert-mode', 'light-mode');
                } else {
                  document.documentElement.classList.add('desert-mode', 'light-mode');
                  document.documentElement.classList.remove('dark');
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
          <div className="app-shell min-h-screen flex flex-col">
            <DynamicBackground />
            <div className="app-content flex-1 flex flex-col">
              <ProfileCompletionModal />
              <CommandPalette />
              {children}
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
