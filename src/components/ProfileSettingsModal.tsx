'use client';

import { createPortal } from 'react-dom';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { X, User, CheckCircle, AlertCircle, Camera, Phone, Calendar, Globe, Moon, Bell, Lock, ShieldCheck, Download, Trash2, Shield, Building2, Briefcase, FileSignature, Video } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

type Tab = 'profile' | 'credentials' | 'preferences' | 'security' | 'data';

export default function ProfileSettingsModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const { user, dbPhoto, dbUser, role, refreshDbUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [theme, setTheme] = useState('dark');
  const [lang, setLang] = useState('en');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // General Profile
  const [name, setName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(dbUser?.phone || '');
  const [dobYear, setDobYear] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(dbPhoto || null);

  // Credentials Tab
  const [organization, setOrganization] = useState('');
  const [journalistType, setJournalistType] = useState('journalist');
  const [occupation, setOccupation] = useState('');
  const [credentialId, setCredentialId] = useState('');

  useEffect(() => {
    if (dbUser) {
      if (dbUser.phone) setPhone(dbUser.phone);
      if (dbUser.dob) {
        const [y, m, d] = dbUser.dob.split('-');
        if (y) setDobYear(y);
        if (m) setDobMonth(m);
        if (d) setDobDay(d);
      }
      if (dbUser.organization) setOrganization(dbUser.organization);
      if (dbUser.journalistType) setJournalistType(dbUser.journalistType);
      if (dbUser.occupation) setOccupation(dbUser.occupation);
      if (dbUser.credentialId) setCredentialId(dbUser.credentialId);
    }
  }, [dbUser]);

  useEffect(() => {
    const savedLang = localStorage.getItem('appLang');
    if (savedLang) setLang(savedLang);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleLanguageChange = async (val: string) => {
    setLang(val);
    localStorage.setItem('appLang', val);
    await refreshDbUser();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Photo must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const userDocRef = doc(db, 'users', user.uid);
      
      const updateData: any = {
        name: name,
        phone: phone,
        photoURL: photoPreview || ''
      };

      if (dobYear && dobMonth && dobDay) {
        updateData.dob = `${dobYear}-${dobMonth}-${dobDay}`;
      }
      
      if (role === 'journalist') {
        updateData.organization = organization;
        updateData.journalistType = journalistType;
      } else if (role === 'official') {
        updateData.organization = organization;
        updateData.occupation = occupation;
        updateData.credentialId = credentialId;
      }
      
      await updateDoc(userDocRef, updateData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const days = Array.from({length: 31}, (_, i) => String(i + 1).padStart(2, '0'));
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 100}, (_, i) => String(currentYear - i));

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col md:flex-row overflow-hidden shadow-2xl relative ">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50">
          <h2 className="text-lg font-bold text-white">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-64 lg:w-72 bg-slate-950/50 border-r border-slate-800 flex flex-col flex-shrink-0">
          <div className="hidden md:flex items-center justify-between p-6">
            <h2 className="text-xl font-bold text-white">Settings</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto py-2 px-4 space-y-1 custom-scrollbar">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'profile' ? 'bg-emerald-600/20 text-emerald-500' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Profile</span>
            </button>
            {(role === 'official' || role === 'journalist') && (
              <button
                onClick={() => setActiveTab('credentials')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'credentials' ? 'bg-emerald-600/20 text-emerald-500' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
              >
                <Shield className="w-5 h-5" />
                <span className="font-medium">Credentials</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('preferences')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'preferences' ? 'bg-emerald-600/20 text-emerald-500' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <Globe className="w-5 h-5" />
              <span className="font-medium">Preferences</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'security' ? 'bg-emerald-600/20 text-emerald-500' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <Lock className="w-5 h-5" />
              <span className="font-medium">Security</span>
            </button>
            <div className="pt-4 mt-4 border-t border-slate-800/50">
              <button
                onClick={() => setActiveTab('data')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'data' ? 'bg-red-600/10 text-red-500' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
              >
                <Trash2 className="w-5 h-5" />
                <span className="font-medium">Data & Privacy</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-h-0 bg-slate-900">
          <div className="hidden md:flex justify-end p-4">
            <button onClick={onClose} className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-8 md:pt-0 custom-scrollbar">
            
            {/* TAB: PROFILE */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSave} className="space-y-8  max-w-3xl">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Public Profile</h3>
                  <p className="text-slate-400 text-sm">Manage your personal information and contact details.</p>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}
                {success && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-500">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">Profile updated successfully!</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-8 items-start">
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-800 border-4 border-slate-950 shadow-xl">
                        {photoPreview ? (
                          <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-emerald-500/10">
                            <User className="w-12 h-12 text-emerald-500" />
                          </div>
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 p-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full cursor-pointer shadow-lg transition-transform hover:scale-105">
                        <Camera className="w-5 h-5" />
                        <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                      </label>
                    </div>
                    <p className="text-xs text-slate-500">JPG, PNG under 2MB</p>
                  </div>

                  <div className="flex-1 space-y-6 w-full">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Display Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="Your Name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        value={user?.email || ''}
                        disabled
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-slate-500 cursor-not-allowed"
                      />
                      <p className="text-xs text-slate-500 mt-2">Email cannot be changed directly.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input 
                          type="tel" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Date of Birth</label>
                      <div className="grid grid-cols-3 gap-3">
                        <select value={dobMonth} onChange={(e) => setDobMonth(e.target.value)} className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-emerald-500">
                          <option value="">Month</option>
                          {months.map((m) => <option key={m} value={m}>{new Date(`2000-${m}-01`).toLocaleString('default', { month: 'short' })}</option>)}
                        </select>
                        <select value={dobDay} onChange={(e) => setDobDay(e.target.value)} className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-emerald-500">
                          <option value="">Day</option>
                          {days.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <select value={dobYear} onChange={(e) => setDobYear(e.target.value)} className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-emerald-500">
                          <option value="">Year</option>
                          {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            )}

            {/* TAB: CREDENTIALS */}
            {activeTab === 'credentials' && (role === 'journalist' || role === 'official') && (
              <form onSubmit={handleSave} className="space-y-8  max-w-2xl">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Official Credentials</h3>
                  <p className="text-slate-400 text-sm">
                    {role === 'official' 
                      ? "Manage your verified organization and legal credentials." 
                      : "Manage your media organization and professional details."}
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}
                {success && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-500">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">Credentials saved securely!</p>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Organization / Network</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input 
                        type="text" 
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        className={`w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none transition-colors ${role === 'official' ? 'focus:border-amber-500' : 'focus:border-blue-500'}`}
                        placeholder={role === 'official' ? "e.g. Human Rights Watch, DOJ" : "e.g. Al Jazeera, Independent"}
                      />
                    </div>
                  </div>

                  {role === 'journalist' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Primary Role</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setJournalistType('journalist')}
                          className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold transition-colors ${
                            journalistType === 'journalist' 
                              ? 'bg-[#c26e27]/20 border-[#c26e27] text-[#c26e27]' 
                              : 'bg-slate-950 border-slate-700 text-slate-500'
                          }`}
                        >
                          <FileSignature className="w-5 h-5" /> Journalist
                        </button>
                        <button
                          type="button"
                          onClick={() => setJournalistType('creator')}
                          className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold transition-colors ${
                            journalistType === 'creator' 
                              ? 'bg-[#c26e27]/20 border-[#c26e27] text-[#c26e27]' 
                              : 'bg-slate-950 border-slate-700 text-slate-500'
                          }`}
                        >
                          <Video className="w-5 h-5" /> Content Creator
                        </button>
                      </div>
                    </div>
                  )}

                  {role === 'official' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Occupation / Title</label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                          <input 
                            type="text" 
                            value={occupation}
                            onChange={(e) => setOccupation(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-amber-500 transition-colors"
                            placeholder="e.g. Civil Rights Lawyer"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Credential ID (Confidential)</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                          <input 
                            type="password" 
                            value={credentialId}
                            onChange={(e) => setCredentialId(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-amber-500 transition-colors"
                            placeholder="Badge or Bar ID"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className={`font-bold py-3 px-8 rounded-xl transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 ${
                      role === 'official' 
                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/20' 
                        : 'bg-[#c26e27] hover:bg-[#a05417] text-white shadow-amber-900/20'
                    }`}
                  >
                    {loading ? 'Saving...' : 'Save Credentials'}
                  </button>
                </div>
              </form>
            )}

            {/* TAB: PREFERENCES */}
            {activeTab === 'preferences' && (
              <div className="space-y-8 ">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Preferences</h3>
                  <p className="text-slate-400 text-sm">Customize your Daleel experience.</p>
                </div>

                <div className="space-y-4">

                    <div className="bg-[#020617]/50 border border-white/5 rounded-2xl p-6 flex items-center justify-between">
                      <div className="flex gap-4">
                        <div className="bg-amber-500/10 p-3 rounded-xl">
                          <Moon className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">Appearance / Theme</h4>
                          <p className="text-slate-400 text-sm">Choose light or dark mode.</p>
                        </div>
                      </div>
                      <select 
                        value={theme} 
                        onChange={(e) => {
                          const val = e.target.value;
                          setTheme(val);
                          localStorage.setItem('theme', val);
                          if (val === 'desert' || val === 'light') {
                            document.documentElement.classList.add('desert-mode', 'light-mode');
                            document.documentElement.classList.remove('dark');
                          } else {
                            document.documentElement.classList.add('dark');
                            document.documentElement.classList.remove('desert-mode', 'light-mode');
                          }
                          window.dispatchEvent(new Event('themechange'));
                        }} 
                        className="bg-[#020617]/70 border border-white/10 text-white rounded-xl px-4 py-3"
                      >
                        <option value="dark">🌙 Greenish Night (Dark Mode)</option>
                        <option value="desert">🏖️ Desert Sand (Warm Beach Light Mode)</option>
                      </select>
                    </div>

                  <div className="bg-[#020617]/50 border border-white/5 rounded-2xl p-6 flex items-center justify-between">
                    <div className="flex gap-4">
                      <div className="bg-emerald-500/10 p-3 rounded-xl">
                        <Globe className="w-6 h-6 text-emerald-500" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Display Language</h4>
                        <p className="text-slate-400 text-sm">Select your primary language.</p>
                      </div>
                    </div>
                    <select value={lang} onChange={(e) => handleLanguageChange(e.target.value)} className="bg-[#020617]/70 border border-white/10 text-white rounded-xl px-4 py-3">
                      <option value="en">English (US)</option>
                      <option value="ar">العربية (Arabic)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            
            
            {/* TAB: SECURITY */}
            {activeTab === 'security' && (
              <div className="space-y-8 ">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Security Settings</h3>
                  <p className="text-slate-400 text-sm">Manage your password and account security.</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-[#020617]/50 border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="bg-[#c26e27]/10 p-3 rounded-xl flex-shrink-0 h-12 w-12 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Change Password</h4>
                        <p className="text-slate-400 text-sm">Update your password to keep your account secure.</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-[#020617]/70 border border-white/10 text-white rounded-xl hover:bg-slate-800 transition-colors">
                      Update Password
                    </button>
                  </div>
                  
                  <div className="bg-[#020617]/50 border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="bg-emerald-500/10 p-3 rounded-xl flex-shrink-0 h-12 w-12 flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-emerald-500" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                        <p className="text-slate-400 text-sm">Add an extra layer of security to your account.</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-emerald-700/80 hover:bg-emerald-600 border border-emerald-500/30 text-white rounded-xl transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: DATA & PRIVACY */}
            {activeTab === 'data' && (
              <div className="space-y-8 ">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Data & Privacy</h3>
                  <p className="text-slate-400 text-sm">Control your data and privacy settings.</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-[#020617]/50 border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="bg-[#c26e27]/10 p-3 rounded-xl flex-shrink-0 h-12 w-12 flex items-center justify-center">
                        <Download className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Download Your Data</h4>
                        <p className="text-slate-400 text-sm">Get a copy of all your reports, evidence, and activity.</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-[#020617]/70 border border-white/10 text-white rounded-xl hover:bg-slate-800 transition-colors">
                      Request Data
                    </button>
                  </div>
                  
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="bg-red-500/20 p-3 rounded-xl flex-shrink-0 h-12 w-12 flex items-center justify-center">
                        <Trash2 className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Delete Account</h4>
                        <p className="text-red-400/80 text-sm">Permanently delete your account and all associated data.</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-colors font-semibold">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}


          </div>
        </div>
      </div>
    </div>, document.body);
}