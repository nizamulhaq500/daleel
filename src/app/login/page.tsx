'use client';

import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Shield, Users, Building, ArrowRight, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import AuthModal from '@/components/AuthModal';

export default function LoginPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('reporter');

  useEffect(() => {
    if (!loading && user && role) {
      router.push(`/dashboard/${role}`);
    }
  }, [user, role, loading, router]);

  const handleLogin = (intendedRole: UserRole) => {
    setSelectedRole(intendedRole);
    setAuthModalOpen(true);
  };

  if (loading || (user && !role)) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-mono text-sm">Authenticating...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-transparent flex flex-col p-6 sm:p-12 relative overflow-hidden">
      
      {/* Background blobs for visual appeal */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2"></div>
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        intendedRole={selectedRole} 
      />

      <div className="max-w-4xl w-full mx-auto relative z-10">
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Select your portal</h1>
          <p className="text-xl text-slate-400">Choose how you want to interact with the Daleel network.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Reporter Card */}
          <button 
            onClick={() => handleLogin('reporter')}
            className="w-full text-left bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 p-8 rounded-3xl transition-all group relative overflow-hidden flex flex-col shadow-xl"
          >
            <div className="bg-emerald-500/10 p-5 rounded-2xl w-max mb-8">
              <Users className="w-8 h-8 text-emerald-500" />
            </div>
            <h4 className="text-white font-bold text-2xl mb-3 flex justify-between items-center">
              Community Reporter
              <ArrowRight className="w-6 h-6 text-slate-600 group-hover:text-emerald-500 transition-colors" />
            </h4>
            <p className="text-slate-400 leading-relaxed">Report hate speech, submit evidence, and generate PDF dossiers.</p>
          </button>

          {/* Journalist Card */}
          <button 
            onClick={() => handleLogin('journalist')}
            className="w-full text-left bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 p-8 rounded-3xl transition-all group relative overflow-hidden flex flex-col shadow-xl"
          >
            <div className="bg-blue-500/10 p-5 rounded-2xl w-max mb-8">
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
            <h4 className="text-white font-bold text-2xl mb-3 flex justify-between items-center">
              Journalist / Org
              <ArrowRight className="w-6 h-6 text-slate-600 group-hover:text-blue-500 transition-colors" />
            </h4>
            <p className="text-slate-400 leading-relaxed">Review community reports, validate claims, and escalate to authorities.</p>
          </button>

          {/* Official Card */}
          <button 
            onClick={() => handleLogin('official')}
            className="w-full text-left bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 p-8 rounded-3xl transition-all group relative overflow-hidden flex flex-col shadow-xl"
          >
            <div className="bg-amber-500/10 p-5 rounded-2xl w-max mb-8">
              <Building className="w-8 h-8 text-amber-500" />
            </div>
            <h4 className="text-white font-bold text-2xl mb-3 flex justify-between items-center">
              Official / Agency
              <ArrowRight className="w-6 h-6 text-slate-600 group-hover:text-amber-500 transition-colors" />
            </h4>
            <p className="text-slate-400 leading-relaxed">Receive verified reports from journalists and take platform/legal action.</p>
          </button>
        </div>
      </div>
    </main>
  );
}
