'use client';

import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Shield, Users, Building, ArrowRight, Brain } from 'lucide-react';
import { BsOctagonHalf } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import NewsTicker from '@/components/NewsTicker';
import { useState } from 'react';
import AuthModal from '@/components/AuthModal';
import FactCheckBot from '@/components/FactCheckBot';

export default function LandingPage({ isBackground = false }: { isBackground?: boolean }) {
  const { user, role } = useAuth();
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('reporter');

  const handleLogin = (intendedRole: UserRole) => {
    if (isBackground) return;
    if (user && role === intendedRole) {
      router.push(`/dashboard/${intendedRole}`);
    } else {
      setSelectedRole(intendedRole);
      setAuthModalOpen(true);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col pointer-events-auto relative">
      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        intendedRole={selectedRole} 
      />

      {/* Header */}
      {!isBackground && (
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50 px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-900/50 shadow-inner shadow-emerald-500/10">
              <BsOctagonHalf className="w-7 h-7 text-emerald-500 rotate-45" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Daleel <span className="text-emerald-500 font-normal">دليل</span>
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <FactCheckBot />
            {user && (
              <button 
                onClick={() => router.push(`/dashboard/${role}`)}
                className="text-sm font-medium text-emerald-400 hover:text-emerald-300"
              >
                Return to Dashboard &rarr;
              </button>
            )}
          </div>
        </header>
      )}

      <div className="flex-1 max-w-7xl mx-auto w-full px-8 py-12 flex flex-col gap-16">
        
        {/* Top Section: Hero & Trending News */}
        <div className="w-full flex flex-col xl:flex-row gap-12 items-center">
          <div className="flex-1 text-center xl:text-left">
            <h2 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-6">
              Combatting <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Islamophobia</span><br /> at Scale.
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto xl:mx-0">
              Daleel uses advanced detection systems to detect coded hate speech, document digital evidence, and establish a verifiable chain of custody from the community to law enforcement.
            </p>
          </div>

          <div className="flex-1 w-full max-w-3xl h-[520px]">
            <NewsTicker />
          </div>
        </div>

        {/* Bottom Section: 3 Login Portals */}
        <div className="w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white">Enter Network</h3>
            <div className="h-px bg-slate-800 flex-1 ml-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Reporter Card */}
            <button 
              onClick={() => handleLogin('reporter')}
              className="w-full text-left bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl transition-all group relative overflow-hidden flex flex-col"
            >
              <div className="bg-emerald-500/10 p-4 rounded-xl w-max mb-6">
                <Users className="w-7 h-7 text-emerald-500" />
              </div>
              <h4 className="text-white font-bold text-xl mb-2 flex justify-between items-center">
                Community Reporter
                <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-500 transition-colors" />
              </h4>
              <p className="text-sm text-slate-400">Report hate speech and generate evidence.</p>
            </button>

            {/* Journalist Card */}
            <button 
              onClick={() => handleLogin('journalist')}
              className="w-full text-left bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition-all group relative overflow-hidden flex flex-col"
            >
              <div className="bg-blue-500/10 p-4 rounded-xl w-max mb-6">
                <Shield className="w-7 h-7 text-blue-500" />
              </div>
              <h4 className="text-white font-bold text-xl mb-2 flex justify-between items-center">
                Journalist / Org
                <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-blue-500 transition-colors" />
              </h4>
              <p className="text-sm text-slate-400">Review community reports and escalate.</p>
            </button>

            {/* Official Card */}
            <button 
              onClick={() => handleLogin('official')}
              className="w-full text-left bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 p-6 rounded-2xl transition-all group relative overflow-hidden flex flex-col"
            >
              <div className="bg-amber-500/10 p-4 rounded-xl w-max mb-6">
                <Building className="w-7 h-7 text-amber-500" />
              </div>
              <h4 className="text-white font-bold text-xl mb-2 flex justify-between items-center">
                Official / Agency
                <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-amber-500 transition-colors" />
              </h4>
              <p className="text-sm text-slate-400">Receive verified reports and take action.</p>
            </button>
          </div>
        </div>

        {/* Bottom Banner for FactCheck Bot */}
        <div className="w-full bg-emerald-950/30 border border-emerald-900/50 p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl mb-8">
          <div className="flex items-center gap-5 text-center sm:text-left">
             <div className="bg-emerald-500/20 p-4 rounded-full shrink-0">
                <Brain className="w-8 h-8 text-emerald-400" />
             </div>
             <div>
                <h4 className="text-xl text-white font-bold mb-1">Have some confusions or need clarification?</h4>
                <p className="text-slate-400">Our Fact-Check Engine can analyze claims, images, and documents instantly.</p>
             </div>
          </div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors shrink-0 shadow-lg shadow-emerald-500/20"
          >
            Ask the AI up top
          </button>
        </div>

      </div>
    </main>
  );
}
