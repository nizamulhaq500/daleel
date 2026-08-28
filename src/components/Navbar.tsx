'use client';

import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Shield, Users, Building, LogOut, ChevronDown, Settings } from 'lucide-react';
import { BsOctagonHalf } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import ProfileSettingsModal from './ProfileSettingsModal';
import FactCheckBot from './FactCheckBot';

export default function Navbar() {
  const { user, role, dbPhoto, signOut } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const roleConfig = {
    reporter: { icon: Users, color: 'text-emerald-400', label: 'Community Reporter' },
    journalist: { icon: Shield, color: 'text-blue-400', label: 'Journalist / Validator' },
    official: { icon: Building, color: 'text-amber-400', label: 'Official / Authority' }
  };

  return (
    <>
      <ProfileSettingsModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
      <nav className="w-full bg-[#090d16]/95 border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => router.push('/')}
          title="Return to Home"
        >
          <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/30">
            <BsOctagonHalf className="w-5 h-5 text-emerald-400 rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-xl tracking-tight text-white">Daleel</h1>
              <span className="text-emerald-400 text-sm font-arabic font-normal">دليل</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
              Trust & Safety Pipeline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 relative" ref={menuRef}>
          {/* Fact-Check Engine Bot in Navbar */}
          <FactCheckBot />

          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="flex items-center gap-2.5 hover:bg-slate-800/80 p-1.5 rounded-xl transition-colors relative border border-transparent hover:border-slate-700"
          >
            <div className="hidden sm:block text-right mr-1">
              <p className="text-xs font-bold text-slate-100 leading-tight truncate max-w-[140px]">
                {user.displayName || user.email?.split('@')[0]}
              </p>
              <span className={`text-[10px] font-semibold ${roleConfig[role].color}`}>
                {roleConfig[role].label}
              </span>
            </div>
            {dbPhoto || user.photoURL ? (
              <img src={dbPhoto || user.photoURL!} alt="Avatar" className="w-8 h-8 rounded-full border border-slate-700 object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-xs">
                {(user.displayName || user.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2">
              <div className="p-4 border-b border-slate-800 bg-slate-900/60">
                <p className="text-xs font-bold text-slate-100">{user.displayName || 'User'}</p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.email}</p>
                <span className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 ${roleConfig[role].color}`}>
                  {roleConfig[role].label}
                </span>
              </div>
              
              <div className="p-2 border-b border-slate-800">
                <button 
                  onClick={() => {
                    setMenuOpen(false);
                    setProfileModalOpen(true);
                  }} 
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  Profile & Settings
                </button>
              </div>

              <div className="p-2">
                <button 
                  onClick={() => {
                    setMenuOpen(false);
                    signOut();
                  }} 
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
