'use client';

import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Shield, Users, Building, LogOut, ChevronDown, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import ProfileSettingsModal from './ProfileSettingsModal';

export default function Navbar() {
  const { user, role, signOut, setRole } = useAuth();
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
    reporter: { icon: Users, color: 'text-emerald-500', label: 'Community Reporter' },
    journalist: { icon: Shield, color: 'text-blue-500', label: 'Journalist / Validator' },
    official: { icon: Building, color: 'text-amber-500', label: 'Official / Authority' }
  };

  const CurrentIcon = roleConfig[role].icon;

  const handleRoleSwitch = (newRole: UserRole) => {
    setRole(newRole);
    setMenuOpen(false);
    router.push(`/dashboard/${newRole}`);
  };

  return (
    <>
      <ProfileSettingsModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
      <nav className="w-full bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => router.push('/')}
          title="Return to Home"
        >
          <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
            <CurrentIcon className={`w-6 h-6 ${roleConfig[role].color}`} />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
              Daleel <span className="text-emerald-500 font-normal">دليل</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Trust & Safety Pipeline</p>
          </div>
        </div>

        <div className="flex items-center gap-6 relative" ref={menuRef}>
          <div 
            className="flex items-center gap-4 cursor-pointer hover:bg-slate-800/50 p-2 rounded-xl transition-colors border border-transparent hover:border-slate-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-white">{user.displayName || user.email || 'User'}</span>
              <span className={`text-xs font-bold ${roleConfig[role].color}`}>{roleConfig[role].label}</span>
            </div>
            {user.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-9 h-9 rounded-full border-2 border-slate-700" />
            ) : (
              <div className="w-9 h-9 rounded-full border-2 border-slate-700 bg-slate-800 flex items-center justify-center text-slate-400 font-bold">
                {(user.displayName || user.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </div>

          {menuOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2">
              <div className="p-4 border-b border-slate-800 bg-slate-950/50">
                <p className="text-sm font-bold text-white">{user.displayName || 'User'}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
              
              <div className="p-2 border-b border-slate-800">
                <button 
                  onClick={() => {
                    setMenuOpen(false);
                    setProfileModalOpen(true);
                  }} 
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  Profile Settings
                </button>
              </div>

              <div className="p-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 py-2">Switch Portal</p>
                
                <button onClick={() => handleRoleSwitch('reporter')} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                  <Users className="w-4 h-4 text-emerald-500" />
                  Community Reporter
                </button>
                <button onClick={() => handleRoleSwitch('journalist')} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                  <Shield className="w-4 h-4 text-blue-500" />
                  Journalist Desk
                </button>
                <button onClick={() => handleRoleSwitch('official')} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                  <Building className="w-4 h-4 text-amber-500" />
                  Agency Inbox
                </button>
              </div>

              <div className="p-2 border-t border-slate-800">
                <button 
                  onClick={() => {
                    setMenuOpen(false);
                    signOut();
                  }} 
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
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
