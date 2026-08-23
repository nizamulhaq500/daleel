'use client';

import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Shield, Users, Building, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import NewsTicker from '@/components/NewsTicker';
import { useState } from 'react';
import AuthModal from '@/components/AuthModal';

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
            <Shield className="w-8 h-8 text-emerald-500" />
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Daleel <span className="text-emerald-500 font-normal">دليل</span>
            </h1>
          </div>
          <div>
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

      <div className="flex-1 max-w-7xl mx-auto w-full px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Trending News & Context */}
        <div className="lg:col-span-7 h-full flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
              Combatting <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Islamophobia</span> at Scale.
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Daleel uses multi-modal AI to detect coded hate speech, document digital evidence, and establish a verifiable chain of custody from the community to law enforcement.
            </p>
          </div>

          <div className="flex-1 min-h-[400px]">
            <NewsTicker />
          </div>
        </div>

        {/* Right Column: 3 Login Portals */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Enter Network</h3>
            
            <div className="space-y-4">
              {/* Reporter Card */}
              <button 
                onClick={() => handleLogin('reporter')}
                className="w-full text-left bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl transition-all group relative overflow-hidden"
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className="bg-emerald-500/10 p-3 rounded-xl">
                    <Users className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Community Reporter</h4>
                    <p className="text-sm text-slate-400 mt-1">Report hate speech and generate evidence.</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-500 ml-auto transition-colors" />
                </div>
              </button>

              {/* Journalist Card */}
              <button 
                onClick={() => handleLogin('journalist')}
                className="w-full text-left bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 p-5 rounded-2xl transition-all group relative overflow-hidden"
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className="bg-blue-500/10 p-3 rounded-xl">
                    <Shield className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Journalist / Org</h4>
                    <p className="text-sm text-slate-400 mt-1">Review community reports and escalate.</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-blue-500 ml-auto transition-colors" />
                </div>
              </button>

              {/* Official Card */}
              <button 
                onClick={() => handleLogin('official')}
                className="w-full text-left bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 p-5 rounded-2xl transition-all group relative overflow-hidden"
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className="bg-amber-500/10 p-3 rounded-xl">
                    <Building className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Official / Agency</h4>
                    <p className="text-sm text-slate-400 mt-1">Receive verified reports and take action.</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-amber-500 ml-auto transition-colors" />
                </div>
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
