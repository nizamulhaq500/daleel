'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { X, User, CheckCircle, AlertCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function ProfileSettingsModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // 1. Update Firebase Auth Profile
      const { updateProfile } = await import('firebase/auth');
      await updateProfile(user, { displayName: name });

      // 2. Update Firestore DB
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { name: name });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Profile Settings</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="mb-4 bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 p-3 rounded-lg text-sm flex items-start gap-2">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Display Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Your Name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
              <input 
                type="email" 
                disabled
                value={user.email || ''}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-2.5 px-4 text-slate-500 cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 mt-1">Email cannot be changed.</p>
            </div>

            <button 
              type="submit" 
              disabled={loading || name === user.displayName}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg py-2.5 font-bold transition-colors mt-4 mb-6"
            >
              {loading ? 'Saving Profile...' : 'Save Profile Changes'}
            </button>
            
            <div className="border-t border-slate-800 pt-6 mt-4">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">App Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-200">Theme Appearance</p>
                    <p className="text-xs text-slate-500">Switch between Light and Dark mode</p>
                  </div>
                  <select className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500">
                    <option value="dark">Dark Mode (Default)</option>
                    <option value="light">Light Mode</option>
                    <option value="system">System Preference</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-200">Language</p>
                    <p className="text-xs text-slate-500">Interface language</p>
                  </div>
                  <select className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500">
                    <option value="en">English (US)</option>
                    <option value="ar">العربية (Arabic)</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
