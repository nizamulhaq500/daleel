'use client';

import { useState } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { BsOctagonHalf } from 'react-icons/bs';
import { 
  Users, 
  Shield, 
  Building, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Lock, 
  Brain, 
  Database,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import FactCheckStudio from '@/components/FactCheckStudio';
import FactCheckBot from '@/components/FactCheckBot';
import NewsTicker from '@/components/NewsTicker';
import CrimesTimeline from '@/components/CrimesTimeline';
import Narratives from '@/components/Narratives';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';

export default function LandingPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('reporter');

  const openAuthForRole = (targetRole: UserRole) => {
    if (user) {
      router.push(`/dashboard/${role || targetRole}`);
    } else {
      setSelectedRole(targetRole);
      setAuthModalOpen(true);
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col bg-[#090d16] text-slate-100 relative selection:bg-emerald-500/30">
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        intendedRole={selectedRole} 
      />

      {/* Top Header / Masthead */}
      <header className="border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/30">
            <BsOctagonHalf className="w-5 h-5 text-emerald-400 rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">Daleel</span>
              <span className="text-emerald-400 text-sm font-arabic font-normal">دليل</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase hidden sm:block">
              Public Interest Trust & Verification Pipeline
            </p>
          </div>
        </div>

        {/* Header Portal Navigation & Login */}
        <div className="flex items-center gap-2 sm:gap-4">
          <FactCheckBot />

          {loading ? (
            <div className="w-20 h-8 bg-slate-800/50 rounded animate-pulse" />
          ) : user ? (
            <button
              onClick={() => router.push(`/dashboard/${role}`)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <span>Workspace ({role})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => openAuthForRole('reporter')}
                className="hidden md:inline-flex text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Reporter
              </button>
              <button 
                onClick={() => openAuthForRole('journalist')}
                className="hidden md:inline-flex text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Journalist Hub
              </button>
              <button 
                onClick={() => openAuthForRole('official')}
                className="hidden md:inline-flex text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Official
              </button>
              <button
                onClick={() => openAuthForRole('reporter')}
                className="text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 hover:border-slate-600 px-3.5 py-2 rounded-lg transition-colors"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Logged in notification banner (if user is logged in) */}
      {!loading && user && (
        <div className="w-full bg-emerald-950/40 border-b border-emerald-800/40 px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs sm:text-sm text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Signed in as <strong>{user.displayName || user.email}</strong> ({role})</span>
          </div>
          <button
            onClick={() => router.push(`/dashboard/${role}`)}
            className="font-semibold underline hover:text-emerald-200 flex items-center gap-1"
          >
            Open Your Investigation Dashboard &rarr;
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-10 flex flex-col gap-16">
        
        {/* HERO SECTION */}
        <section className="w-full flex flex-col items-center text-center max-w-4xl mx-auto pt-4 pb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs text-slate-300 font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Open-Access Hate Speech Verification & Evidence Repository</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight leading-[1.15] mb-6">
            Forensic Evidence & Counter-Narratives for Online Anti-Muslim Hate.
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-3xl mb-8">
            Daleel provides a verifiable chain of custody to identify coded dog-whistles, fact-check viral disinformation with peer-reviewed research, and package signed digital evidence for journalists, researchers, and public authorities.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-400 font-medium pb-2">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Academic & UN Indexed</span>
            <span className="text-slate-700 hidden sm:inline">&bull;</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Cryptographic Dossiers</span>
            <span className="text-slate-700 hidden sm:inline">&bull;</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real-Time Fact Checking</span>
          </div>
        </section>

        {/* HERO FEATURE: HIGHLY PROMINENT FACT-CHECKING STUDIO */}
        <section className="w-full">
          <FactCheckStudio />
        </section>

        {/* PORTAL GATEWAYS SECTION: INTEGRATED MAIN-PAGE AUTH */}
        <section id="portals" className="w-full py-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1 block">
                Role-Based Investigation Pipeline
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
                Select Your Investigation Portal
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Choose your role to access specialized tools, verify claims, or take platform & legal action.
              </p>
            </div>
            <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg w-max">
              End-to-End Chain of Custody
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* PORTAL 1: Community Reporter */}
            <div className="bg-[#0f172a] border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-6 flex flex-col justify-between transition-all group hover:shadow-xl">
              <div>
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mb-5">
                  <Users className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                    Community Reporter
                  </h3>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Citizen Level
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4 font-medium">
                  For individual witnesses, activists, and digital observers.
                </p>
                <ul className="space-y-2.5 mb-6 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Upload screenshots & document viral hate speech</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Instant AI detection of coded slurs & genocide memes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Export tamper-evident signed PDF evidence dossiers</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => openAuthForRole('reporter')}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-3 px-4 rounded-xl transition-colors shadow-sm"
              >
                <span>{user && role === 'reporter' ? 'Open Reporter Workspace' : 'Enter Reporter Portal'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* PORTAL 2: Journalist & Fact-Checker */}
            <div className="bg-[#0f172a] border border-slate-800 hover:border-blue-500/40 rounded-2xl p-6 flex flex-col justify-between transition-all group hover:shadow-xl">
              <div>
                <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mb-5">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                    Journalist / Validator
                  </h3>
                  <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                    Investigative
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4 font-medium">
                  For newsrooms, watchdog NGOs, and research institutions.
                </p>
                <ul className="space-y-2.5 mb-6 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>Review & triage community submissions in real-time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>Cross-reference platform terms of service violations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>Validate and escalate verified cases to public authorities</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => openAuthForRole('journalist')}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-3 px-4 rounded-xl transition-colors shadow-sm"
              >
                <span>{user && role === 'journalist' ? 'Open Journalist Workspace' : 'Enter Journalist Hub'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* PORTAL 3: Official & Public Agency */}
            <div className="bg-[#0f172a] border border-slate-800 hover:border-amber-500/40 rounded-2xl p-6 flex flex-col justify-between transition-all group hover:shadow-xl">
              <div>
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center mb-5">
                  <Building className="w-6 h-6 text-amber-400" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                    Official / Authority
                  </h3>
                  <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    Enforcement
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4 font-medium">
                  For law enforcement, platform trust & safety, and legal bodies.
                </p>
                <ul className="space-y-2.5 mb-6 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Receive cryptographically verifiable incident dossiers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Track extremist coordination & bot amplification patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Coordinate platform takedowns & civil rights legal action</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => openAuthForRole('official')}
                className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold py-3 px-4 rounded-xl transition-colors shadow-sm"
              >
                <span>{user && role === 'official' ? 'Open Official Workspace' : 'Enter Official Portal'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </section>

        {/* REAL-TIME THREAT TRACKER SECTION */}
        <section className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Narrative Column */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1 block">
                  Threat Intelligence Desk
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight mb-4">
                  Real-Time Cross-Platform Detection
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Online Islamophobia relies on coded language, decontextualized videos, and dog-whistles engineered to evade conventional AI moderation. Daleel actively cross-references posts against recognized threat vocabularies.
                </p>
                
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <div>
                      <strong className="text-slate-100 block">Srebrenica & Genocide Dog-Whistles:</strong>
                      <span>Cataloged symbols (e.g. "Remove Kebab", crusader iconography) flagged for incitement.</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <div>
                      <strong className="text-slate-100 block">Economic Conspiracy Theories:</strong>
                      <span>Disinformation regarding Halal food certification and stealth taxation refuted with commercial audit facts.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Data Partners: ISPU &bull; Tell MAMA</span>
                <a href="#portals" className="text-emerald-400 font-semibold hover:underline">
                  Submit a Case &rarr;
                </a>
              </div>
            </div>

            {/* Right Ticker Widget */}
            <div className="lg:col-span-7 min-h-[420px]">
              <NewsTicker />
            </div>

          </div>
        </section>

        {/* VERIFIED KNOWLEDGE BASE / NARRATIVES */}
        <section className="w-full">
          <Narratives />
        </section>

        {/* HISTORICAL EVIDENCE & CRIMES TIMELINE */}
        <section className="w-full">
          <CrimesTimeline />
        </section>

      </div>

      <Footer />
    </main>
  );
}
