'use client';

import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Shield, Users, Building, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import AuthModal from '@/components/AuthModal';

export default function LoginPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('reporter');

  useEffect(() => {
    if (!loading && user && role && !authModalOpen) {
      router.push(`/dashboard/${role}`);
    }
  }, [user, role, loading, router, authModalOpen]);

  const handleLogin = (intendedRole: UserRole) => {
    setSelectedRole(intendedRole);
    setAuthModalOpen(true);
  };

  if (loading || (user && !role)) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-mono text-xs">Authenticating session...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#090d16] flex flex-col p-6 sm:p-12 relative">
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        intendedRole={selectedRole} 
      />

      <div className="max-w-4xl w-full mx-auto relative z-10">
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-10 bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg w-max"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </button>

        <div className="mb-10 pb-6 border-b border-slate-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1 block">
            Role Gateway
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight mb-2">
            Select Your Investigation Portal
          </h1>
          <p className="text-sm text-slate-400">
            Sign in with your verified credentials or register to begin contributing to the evidence chain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Reporter Card */}
          <div 
            onClick={() => handleLogin('reporter')}
            className="bg-[#0f172a] border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl transition-all cursor-pointer flex flex-col justify-between group hover:shadow-xl"
          >
            <div>
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mb-5">
                <Users className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="text-slate-100 font-bold text-lg mb-2 group-hover:text-emerald-400 transition-colors">
                Community Reporter
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Document social media hate speech, decode veiled tropes, and generate signed PDF evidence dossiers.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 pt-4 border-t border-slate-800/80">
              <span>Sign In / Register</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Journalist Card */}
          <div 
            onClick={() => handleLogin('journalist')}
            className="bg-[#0f172a] border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition-all cursor-pointer flex flex-col justify-between group hover:shadow-xl"
          >
            <div>
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mb-5">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-slate-100 font-bold text-lg mb-2 group-hover:text-blue-400 transition-colors">
                Journalist / Validator
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Review community reports, cross-reference policy violations, and escalate verified cases.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-blue-400 pt-4 border-t border-slate-800/80">
              <span>Sign In / Register</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Official Card */}
          <div 
            onClick={() => handleLogin('official')}
            className="bg-[#0f172a] border border-slate-800 hover:border-amber-500/50 p-6 rounded-2xl transition-all cursor-pointer flex flex-col justify-between group hover:shadow-xl"
          >
            <div>
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center mb-5">
                <Building className="w-6 h-6 text-amber-400" />
              </div>
              <h4 className="text-slate-100 font-bold text-lg mb-2 group-hover:text-amber-400 transition-colors">
                Official / Authority
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Receive structured legal evidence packages, track network coordination, and coordinate enforcement.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-amber-400 pt-4 border-t border-slate-800/80">
              <span>Sign In / Register</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
