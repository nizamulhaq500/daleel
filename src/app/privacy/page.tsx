import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Database, 
  Lock, 
  Share2, 
  Clock, 
  UserCheck, 
  Cookie, 
  Mail, 
  FileText,
  AlertCircle
} from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Daleel (دليل)',
  description: 'Learn how Daleel handles, protects, and minimizes your data across the 3-tier Trust & Safety evidence pipeline.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#fcf8f2] dark:bg-[#090d16] text-[#1e140d] dark:text-slate-50 relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-emerald-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-600/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 relative z-10">
        
        {/* Navigation / Back Button */}
        <div className="mb-10">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-emerald-400 transition-colors bg-[#ffffff] dark:bg-slate-900 border border-[#dfd2bf] dark:border-slate-800 text-[#1e140d] dark:text-slate-300 hover:border-[#c26e27] dark:hover:border-emerald-500/30 px-4 py-2.5 rounded-xl shadow-lg backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Daleel Platform
          </Link>
        </div>

        {/* Title & Metadata Banner */}
        <div className="border-b border-slate-800 pb-8 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-500/20 p-2.5 rounded-xl border border-emerald-500/30 shadow-inner shadow-emerald-500/20">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                Trust & Safety Framework
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-[#1e140d] dark:text-white tracking-tight mt-1">
                Privacy Policy
              </h1>
            </div>
          </div>
          <p className="text-[#523d2e] dark:text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl">
            Daleel (دليل) is dedicated to protecting the privacy, safety, and digital dignity of individuals and communities documenting anti-Muslim hate speech.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500">
            <span>Last Updated: August 2026</span>
            <span>•</span>
            <span>Version: 1.0 (Harvest Hackathon Release)</span>
          </div>
        </div>

        {/* Ethical Summary Notice */}
        <div className="bg-[#eaf2ed] dark:bg-emerald-950/30 border border-[#cce0d4] dark:border-emerald-800/60 rounded-2xl p-5 md:p-6 mb-12 flex items-start gap-4 shadow-sm">
          <AlertCircle className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-sm text-[#1b2d23] dark:text-[#382619] dark:text-slate-300 leading-relaxed">
            <strong className="text-[#13633d] dark:text-white block font-bold mb-1">Our Core Commitment: Zero Monetization & Data Minimization</strong>
            We never sell, rent, or monetize your data. Evidence is processed strictly for hate speech classification, chain-of-custody documentation, and escalation to verified journalists and legal advocates.
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-10">

          {/* Section 1: Data Collection */}
          <section className="bg-[#ffffff] dark:bg-[#0f172a] border border-[#dfd2bf] dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm hover:border-[#c26e27]/40 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#1e140d] dark:text-white">1. Data Collection</h2>
            </div>
            <p className="text-[#382619] dark:text-slate-300 leading-relaxed mb-4">
              We practice strict data minimization. Depending on how you interact with Daleel, we may collect the following categories of information:
            </p>
            <ul className="space-y-3 text-[#382619] dark:text-slate-300 text-sm list-disc pl-5">
              <li>
                <strong className="text-[#1e140d] dark:text-slate-100">Account Credentials:</strong> When you register via Google OAuth or Email/Password, we collect your name, email address, and profile photo.
              </li>
              <li>
                <strong className="text-[#1e140d] dark:text-slate-100">Incident Evidence & Reports:</strong> When you report hate speech, we collect the submitted text snippets, source social media URLs, timestamp metadata, and uploaded screenshots or images.
              </li>
              <li>
                <strong className="text-[#1e140d] dark:text-slate-100">Anonymous Reports:</strong> Community reporters may opt to submit incidents anonymously, in which case no personal identity is linked to the evidence payload.
              </li>
            </ul>
          </section>

          {/* Section 2: Data Storage & Security */}
          <section className="bg-[#ffffff] dark:bg-[#0f172a] border border-[#dfd2bf] dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm hover:border-[#c26e27]/40 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <Database className="w-5 h-5" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#1e140d] dark:text-white">2. Data Storage & Security</h2>
            </div>
            <p className="text-[#382619] dark:text-slate-300 leading-relaxed mb-4">
              All infrastructure is designed with high-grade cloud security and tamper-evident audit logging:
            </p>
            <ul className="space-y-3 text-[#382619] dark:text-slate-300 text-sm list-disc pl-5">
              <li>
                <strong className="text-[#1e140d] dark:text-slate-100">Storage Infrastructure:</strong> Data is hosted securely on Google Cloud Firebase (Cloud Firestore & Firebase Storage) with AES-256 encryption at rest and TLS 1.3 encryption in transit.
              </li>
              <li>
                <strong className="text-[#1e140d] dark:text-slate-100">Granular Access Control:</strong> Access to evidence dossiers is strictly governed by role-based Firestore security rules, ensuring only authenticated reporters, journalists, and authorized officials view relevant data tiers.
              </li>
            </ul>
          </section>

          {/* Section 3: Data Sharing & The 3-Tier Pipeline */}
          <section className="bg-[#ffffff] dark:bg-[#0f172a] border border-[#dfd2bf] dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm hover:border-[#c26e27]/40 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <Share2 className="w-5 h-5" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#1e140d] dark:text-white">3. Data Sharing & Pipeline Routing</h2>
            </div>
            <p className="text-[#382619] dark:text-slate-300 leading-relaxed mb-4">
              We do not sell, license, or monetize your information. Incident reports are routed strictly through the Daleel 3-tier validation hierarchy:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl text-center">
                <div className="text-xs font-mono text-emerald-400 uppercase font-semibold mb-1">Tier 1</div>
                <div className="text-sm font-bold text-white">Community Reporter</div>
                <p className="text-xs text-slate-400 mt-1">Ingests & analyzes initial content</p>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl text-center">
                <div className="text-xs font-mono text-blue-400 uppercase font-semibold mb-1">Tier 2</div>
                <div className="text-sm font-bold text-white">Journalist Validator</div>
                <p className="text-xs text-slate-400 mt-1">Cross-references & verifies claims</p>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl text-center">
                <div className="text-xs font-mono text-amber-400 uppercase font-semibold mb-1">Tier 3</div>
                <div className="text-sm font-bold text-white">Official / Legal</div>
                <p className="text-xs text-slate-400 mt-1">Receives verified dossier packages</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              *AI analysis is conducted using Google Gemini Flash and Google Perspective API solely for content classification and toxicity scoring. No user data is used to train public commercial AI models without explicit consent.
            </p>
          </section>

          {/* Section 4: Data Retention */}
          <section className="bg-[#ffffff] dark:bg-[#0f172a] border border-[#dfd2bf] dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm hover:border-[#c26e27]/40 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#1e140d] dark:text-white">4. Data Retention</h2>
            </div>
            <ul className="space-y-3 text-[#382619] dark:text-slate-300 text-sm list-disc pl-5">
              <li>
                <strong className="text-[#1e140d] dark:text-slate-100">Incident Reports:</strong> Raw unverified incident submissions and evidence records are retained for a maximum of <strong>90 days</strong> in the active queue, after which unescalated records are permanently purged.
              </li>
              <li>
                <strong className="text-[#1e140d] dark:text-slate-100">User Accounts:</strong> Account profiles and preferences are retained for as long as your account remains active or until you request account deletion.
              </li>
            </ul>
          </section>

          {/* Section 5: User Rights & Data Control */}
          <section className="bg-[#ffffff] dark:bg-[#0f172a] border border-[#dfd2bf] dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm hover:border-[#c26e27]/40 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#1e140d] dark:text-white">5. Your Rights & Data Control</h2>
            </div>
            <p className="text-[#382619] dark:text-slate-300 leading-relaxed mb-4">
              You maintain full ownership of your data. Under global digital privacy standards (including GDPR and CCPA), you hold the following rights:
            </p>
            <ul className="space-y-3 text-[#382619] dark:text-slate-300 text-sm list-disc pl-5">
              <li>
                <strong className="text-[#1e140d] dark:text-slate-100">Access & Export:</strong> You can request a complete JSON or PDF export of all your submitted reports and profile history.
              </li>
              <li>
                <strong className="text-[#1e140d] dark:text-slate-100">Right to Erasure (Deletion):</strong> You can delete specific reports or permanently delete your entire account through the application settings (<span className="text-emerald-400 font-mono">Settings &gt; Data &amp; Privacy</span>) or by emailing us directly.
              </li>
            </ul>
          </section>

          {/* Section 6: Cookies & Tracking */}
          <section className="bg-[#ffffff] dark:bg-[#0f172a] border border-[#dfd2bf] dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm hover:border-[#c26e27]/40 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <Cookie className="w-5 h-5" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#1e140d] dark:text-white">6. Cookies & Tracking Technologies</h2>
            </div>
            <p className="text-[#382619] dark:text-slate-300 leading-relaxed text-sm">
              Daleel utilizes only strictly necessary first-party session cookies required for Firebase Authentication state management and security token persistence. We do not employ third-party advertising cookies, cross-site trackers, or commercial marketing pixels.
            </p>
          </section>

          {/* Section 7: Contact & Inquiries */}
          <section className="bg-[#ffffff] dark:bg-[#0f172a] border border-[#dfd2bf] dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm hover:border-[#c26e27]/40 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#1e140d] dark:text-white">7. Contact Information</h2>
            </div>
            <p className="text-[#382619] dark:text-slate-300 leading-relaxed text-sm mb-4">
              If you have any questions, data deletion requests, or security inquiries regarding this policy, please reach out to our privacy and ethics team:
            </p>
            <div className="bg-[#f7efe4] dark:bg-slate-950 border border-[#dfd2bf] dark:border-slate-800 p-4 rounded-xl inline-flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#c26e27] dark:text-emerald-400" />
              <a 
                href="mailto:daleeel.project@gmail.com" 
                className="text-[#c26e27] dark:text-emerald-400 font-mono text-sm font-bold hover:underline"
              >
                daleeel.project@gmail.com
              </a>
            </div>
          </section>

        </div>

        {/* Footer Link back to platform */}
        <div className="mt-16 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© 2026 Daleel Organization. Built for The Harvest Anti-Muslim Hate Hackathon.</p>
          <Link href="/" className="text-slate-400 hover:text-emerald-400 transition-colors">
            Return to Homepage
          </Link>
        </div>

      </div>
    </main>
  );
}
