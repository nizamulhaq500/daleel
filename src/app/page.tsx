'use client';

import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ReporterPage from '@/app/dashboard/reporter/page';
import JournalistPage from '@/app/dashboard/journalist/page';
import OfficialPage from '@/app/dashboard/official/page';
import { Brain } from 'lucide-react';
import { BsOctagonHalf } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import NewsTicker from '@/components/NewsTicker';
import FactCheckBot from '@/components/FactCheckBot';
import CrimesTimeline from '@/components/CrimesTimeline';
import Narratives from '@/components/Narratives';
import Footer from '@/components/Footer';

function LandingContent({ isBackground = false }: { isBackground?: boolean }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  return (
    <main className="w-full flex flex-col relative">
      {/* Header */}
            {!isBackground && (
        user ? (
          <Navbar />
        ) : (
          <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50 px-4 sm:px-8 py-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-900/50 shadow-inner shadow-emerald-500/10">
                <BsOctagonHalf className="w-7 h-7 text-emerald-500 rotate-45" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                Daleel <span className="text-emerald-500 font-normal">دليل</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <FactCheckBot />
              <button 
                onClick={() => router.push('/login')}
                className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Login / Signup
              </button>
            </div>
          </header>
        )
      )}

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 flex flex-col gap-12">
        
        {/* User Workspace (If Logged In) */}
        {!loading && user && (
          <div className="w-full bg-[#020617]/50 border border-white/5 shadow-2xl backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            {role === 'reporter' && <ReporterPage />}
            {role === 'journalist' && <JournalistPage />}
            {role === 'official' && <OfficialPage />}
          </div>
        )}

        {/* Top Section: Hero & Trending News */}
        <div className="w-full flex flex-col xl:flex-row gap-12 items-center">
          <div className="flex-1 text-center xl:text-left">
            <h2 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-6">
              Combatting <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Islamophobia</span><br /> at Scale.
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto xl:mx-0">
              Daleel uses advanced detection systems to detect coded hate speech, document digital evidence, and establish a verifiable chain of custody from the community to law enforcement.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center xl:justify-start gap-4 sm:gap-6 text-sm font-medium text-emerald-500/80">
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Live sources</span>
              <span className="text-emerald-500/30 hidden sm:inline">&bull;</span>
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Verified evidence</span>
              <span className="text-emerald-500/30 hidden sm:inline">&bull;</span>
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Community reports</span>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md mx-auto xl:mx-0 min-h-[400px] h-[65vh] sm:h-[480px]">
            <NewsTicker />
          </div>
        </div>

        {/* Real World Impact Timeline Section */}
        <CrimesTimeline />
        <Narratives />

        {/* Bottom Banner for FactCheck Bot */}
        <div className="w-full bg-emerald-950/30 border border-emerald-900/50 p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
             <div className="bg-emerald-500/20 p-4 rounded-full shrink-0">
                <Brain className="w-8 h-8 text-emerald-400" />
             </div>
             <div>
                <h4 className="text-xl text-white font-bold mb-1">Have some confusions or need clarification?</h4>
                <p className="text-slate-400">Our Fact-Check Engine can analyze claims, images, and documents instantly.</p>
             </div>
          </div>
          <button 
            onClick={() => {
              window.dispatchEvent(new Event('open-fact-check-bot'));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className="px-6 py-3 bg-emerald-700/80 hover:bg-emerald-600 backdrop-blur-sm border border-emerald-500/30 shadow-lg shadow-emerald-900/20 text-white font-bold rounded-xl transition-colors shrink-0 shadow-lg shadow-emerald-500/20"
          >
            Ask Daleel
          </button>
        </div>

      </div>
      {!isBackground && <Footer />}
    </main>
  );
}


export default function LandingPage() { return <LandingContent />; }
