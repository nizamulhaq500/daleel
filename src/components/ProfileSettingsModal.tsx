'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { X, User, CheckCircle, AlertCircle, Camera, Phone, Calendar, Globe, Moon, Bell, Lock, ShieldCheck, Download, Trash2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

type Tab = 'profile' | 'preferences' | 'security' | 'data';

export default function ProfileSettingsModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const { user, dbPhoto, dbUser } = useAuth();
  

  const [activeTab, setActiveTab] = useState<Tab>('profile');
  
  const [theme, setTheme] = useState('dark');
  const [lang, setLang] = useState('en');

  useEffect(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    // Check current language cookie
    const match = document.cookie.match(/googtrans=\/en\/([a-z-]+)/);
    if (match && match[1]) {
      setLang(match[1]);
    } else {
      setLang('en');
    }
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else if (newTheme === 'dark') {
      document.documentElement.classList.remove('light-mode');
    } else {
      // System logic: check prefers-color-scheme
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.documentElement.classList.add('light-mode');
      } else {
        document.documentElement.classList.remove('light-mode');
      }
    }
  };

  const handleLanguageChange = (newLang: string) => {
    setLang(newLang);
    if (newLang === 'en') {
      document.cookie = 'googtrans=/en/en; path=/';
      document.cookie = 'googtrans=/en/en; domain=' + window.location.hostname + '; path=/';
    } else {
      document.cookie = `googtrans=/en/${newLang}; path=/`;
      document.cookie = `googtrans=/en/${newLang}; domain=` + window.location.hostname + `; path=/`;
    }
    window.location.reload();
  };

  
  const [name, setName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(dbUser?.phone || '');

  useEffect(() => {
    if (dbUser) {
      if (dbUser.phone) setPhone(dbUser.phone);
      if (dbUser.dob) {
        const [y, m, d] = dbUser.dob.split('-');
        if (y) setDobYear(y);
        if (m) setDobMonth(m);
        if (d) setDobDay(d);
      }
    }
  }, [dbUser]);

  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [photoPreview, setPhotoPreview] = useState(dbPhoto || user?.photoURL || '');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !user) return null;

  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 200;
        let w = img.width, h = img.height;
        if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } } 
        else { if (h > MAX) { w *= MAX / h; h = MAX; } }
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, w, h);
        setPhotoPreview(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };
  
  const handleRemovePhoto = () => setPhotoPreview('');

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
      await updateDoc(userDocRef, { 
        name: name,
        phone: phone,
        dob: `${dobYear}-${dobMonth}-${dobDay}`,
        photoURL: photoPreview || ''
      });

      setSuccess(true);
      setTimeout(() => { setSuccess(false); window.location.reload(); }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'data', label: 'Data & Privacy', icon: Download },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-[600px]">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 bg-slate-950/50 border-r border-slate-800 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white">Settings</h2>
            <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex-1 space-y-2 overflow-y-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${
                  activeTab === tab.id 
                    ? 'bg-emerald-500/10 text-emerald-500' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors hidden md:block z-10">
            <X className="w-6 h-6" />
          </button>

          <div className="flex-1 overflow-y-auto p-6 md:p-10">
            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className="mb-6 bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 p-4 rounded-xl text-sm flex items-start gap-3">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            {/* TAB: PROFILE */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Public Profile</h3>
                  <p className="text-slate-400 text-sm">Manage your personal information and how you appear on Daleel.</p>
                </div>

                {/* Avatar Upload */}
                <div className="flex items-center gap-6">
                  <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center overflow-hidden">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-slate-500" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleImageUpload} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Profile Photo</h4>
                    <p className="text-slate-400 text-sm mb-3">JPG, GIF or PNG. Max size of 5MB.</p>
                    <div className="flex gap-3">
                      <button type="button" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-lg transition-colors font-medium relative">
                        Upload Image
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleImageUpload} />
                      </button>
                      <button type="button" onClick={handleRemovePhoto} className="px-4 py-2 text-red-500 hover:bg-red-500/10 text-sm rounded-lg transition-colors font-medium">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Display Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="Your Name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      disabled
                      value={user.email || ''}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-slate-500 cursor-not-allowed"
                    />
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

                  
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Date of Birth</label>
                    <div className="flex gap-3">
                      <select value={dobMonth} onChange={e => setDobMonth(e.target.value)} className="flex-1 bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500">
                        <option value="" disabled>Month</option>
                        {Array.from({length: 12}, (_, i) => <option key={i+1} value={String(i+1).padStart(2, '0')}>{new Date(2000, i).toLocaleString('default', { month: 'short' })}</option>)}
                      </select>
                      <select value={dobDay} onChange={e => setDobDay(e.target.value)} className="flex-1 bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500">
                        <option value="" disabled>Day</option>
                        {Array.from({length: 31}, (_, i) => <option key={i+1} value={String(i+1).padStart(2, '0')}>{i+1}</option>)}
                      </select>
                      <select value={dobYear} onChange={e => setDobYear(e.target.value)} className="flex-1 bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500">
                        <option value="" disabled>Year</option>
                        {Array.from({length: 100}, (_, i) => <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>)}
                      </select>
                    </div>
                  </div>

                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-all"
                  >
                    {loading ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            )}

            {/* TAB: PREFERENCES */}
            {activeTab === 'preferences' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">App Preferences</h3>
                  <p className="text-slate-400 text-sm">Customize your Daleel experience.</p>
                </div>

                <div className="space-y-6">
                  {/* Theme Settings */}
                  <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="bg-blue-500/10 p-3 rounded-xl h-max">
                        <Moon className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-1">Theme Appearance</h4>
                        <p className="text-slate-400 text-sm">Choose how Daleel looks to you.</p>
                      </div>
                    </div>
                    <select value={theme} onChange={(e) => handleThemeChange(e.target.value)} className="bg-slate-900 border border-slate-700 text-white font-medium rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 min-w-[150px]">
                      <option value="system">System Default</option>
                      <option value="dark">Dark Mode</option>
                      <option value="light">Light Mode</option>
                    </select>
                  </div>

                  {/* Language Settings */}
                  <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="bg-emerald-500/10 p-3 rounded-xl h-max">
                        <Globe className="w-6 h-6 text-emerald-500" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-1">Display Language</h4>
                        <p className="text-slate-400 text-sm">Select your primary language.</p>
                      </div>
                    </div>
                    <select value={lang} onChange={(e) => handleLanguageChange(e.target.value)} className="bg-slate-900 border border-slate-700 text-white font-medium rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 min-w-[150px]">
                      <option value="en">English (US)</option>
                      <option value="ar">العربية (Arabic)</option>
                      <option value="ur">اردو (Urdu)</option>
                      <option value="hi">हिन्दी (Hindi)</option>
                      <option value="fr">Français (French)</option>
                      <option value="es">Español (Spanish)</option>
                      <option value="tr">Türkçe (Turkish)</option>
                      <option value="id">Bahasa Indonesia</option>
                    </select>
                  </div>

                  {/* Notifications */}
                  <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="bg-amber-500/10 p-3 rounded-xl h-max">
                        <Bell className="w-6 h-6 text-amber-500" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-1">Email Notifications</h4>
                        <p className="text-slate-400 text-sm">Get alerts when your reports are updated.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SECURITY */}
            {activeTab === 'security' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Security Settings</h3>
                  <p className="text-slate-400 text-sm">Keep your Daleel account secure.</p>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex gap-4">
                        <div className="bg-indigo-500/10 p-3 rounded-xl h-max">
                          <Lock className="w-6 h-6 text-indigo-500" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-1">Password</h4>
                          <p className="text-slate-400 text-sm">Last changed 3 months ago</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium text-sm">
                        Change Password
                      </button>
                    </div>
                    
                    <hr className="border-slate-800 my-6" />

                    <div className="flex items-center justify-between">
                      <div className="flex gap-4">
                        <div className="bg-emerald-500/10 p-3 rounded-xl h-max">
                          <ShieldCheck className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-1">Two-Factor Authentication (2FA)</h4>
                          <p className="text-slate-400 text-sm max-w-sm">Add an extra layer of security to your account. We highly recommend turning this on.</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors font-medium text-sm">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: DATA & PRIVACY */}
            {activeTab === 'data' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Data & Privacy</h3>
                  <p className="text-slate-400 text-sm">Control your data and privacy settings.</p>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="bg-blue-500/10 p-3 rounded-xl h-max">
                        <Download className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-1">Export Account Data</h4>
                        <p className="text-slate-400 text-sm">Download a copy of your submitted reports and evidence.</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium text-sm whitespace-nowrap">
                      Request Archive
                    </button>
                  </div>

                  <div className="bg-red-500/5 border border-red-900/30 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="bg-red-500/10 p-3 rounded-xl h-max">
                        <Trash2 className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <h4 className="text-red-500 font-medium mb-1">Delete Account</h4>
                        <p className="text-slate-400 text-sm max-w-sm">Permanently delete your account and all associated data. This action cannot be undone.</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors font-medium text-sm whitespace-nowrap shadow-lg shadow-red-500/20">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
