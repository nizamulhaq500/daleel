
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Shield, Building2, Briefcase, FileSignature, CheckCircle, Video, Lock, UserCircle, X } from 'lucide-react';

export default function ProfileCompletionModal() {
  const { user, dbUser, role, refreshDbUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Form states based on role
  const [phone, setPhone] = useState(dbUser?.phone || '');
  const [dob, setDob] = useState(dbUser?.dob || '');
  const [organization, setOrganization] = useState(dbUser?.organization || '');
  const [journalistType, setJournalistType] = useState(dbUser?.journalistType || 'journalist');
  const [occupation, setOccupation] = useState(dbUser?.occupation || '');
  const [credentialId, setCredentialId] = useState(dbUser?.credentialId || '');

  // Determine if profile is incomplete based on role
  const needsReporterCompletion = role === 'reporter' && (!dbUser?.phone || !dbUser?.dob);
  const needsJournalistCompletion = role === 'journalist' && (!dbUser?.organization || !dbUser?.journalistType);
  const needsOfficialCompletion = role === 'official' && (!dbUser?.organization || !dbUser?.occupation || !dbUser?.credentialId);

  const needsCompletion = user && dbUser && (needsReporterCompletion || needsJournalistCompletion || needsOfficialCompletion);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const userRef = doc(db, 'users', user.uid);
      let updateData: any = {};
      
      if (role === 'reporter') {
        updateData.phone = phone;
        updateData.dob = dob;
      } else if (role === 'journalist') {
        updateData.organization = organization;
        updateData.journalistType = journalistType;
      } else if (role === 'official') {
        updateData.organization = organization;
        updateData.occupation = occupation;
        updateData.credentialId = credentialId;
      }

      await updateDoc(userRef, updateData);
      await refreshDbUser(); 
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!needsCompletion || isDismissed) {
    return null; // Return nothing if no completion needed or not logged in
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95">

        <button 
          onClick={() => setIsDismissed(true)} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        
        {role === 'official' && <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>}
        {role === 'journalist' && <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>}
        {role === 'reporter' && <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>}

        <div className="text-center mb-8">
          {role === 'official' ? (
            <div className="bg-amber-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-amber-500" />
            </div>
          ) : role === 'journalist' ? (
            <div className="bg-blue-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileSignature className="w-8 h-8 text-blue-500" />
            </div>
          ) : (
            <div className="bg-emerald-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCircle className="w-8 h-8 text-emerald-500" />
            </div>
          )}
          <h2 className="text-2xl font-bold text-white mb-2">
            Complete Your Profile
          </h2>
          <p className="text-slate-400 text-sm">
            {role === 'official' 
              ? 'Please provide your official credentials for accountability.'
              : role === 'journalist'
              ? 'Help us personalize your dashboard by providing your organization info.'
              : 'Update your contact info to help verify your community reports.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {role === 'reporter' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Date of Birth</label>
                <input 
                  type="date" 
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </>
          )}

          {(role === 'journalist' || role === 'official') && (
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Organization / Network</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  required
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className={`w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none transition-colors ${role === 'official' ? 'focus:border-amber-500' : 'focus:border-blue-500'}`}
                  placeholder={role === 'official' ? "e.g., Human Rights Watch, DOJ" : "e.g., Al Jazeera, Independent"}
                />
              </div>
            </div>
          )}

          {role === 'journalist' && (
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Primary Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setJournalistType('journalist')}
                  className={`py-2 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold transition-colors ${
                    journalistType === 'journalist' 
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  <FileSignature className="w-4 h-4" />
                  Journalist
                </button>
                <button
                  type="button"
                  onClick={() => setJournalistType('creator')}
                  className={`py-2 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold transition-colors ${
                    journalistType === 'creator' 
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  Creator
                </button>
              </div>
            </div>
          )}

          {role === 'official' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Occupation / Title</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    required
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="e.g., Civil Rights Lawyer, Policy Enforcer"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Bar / Credential ID (Confidential)</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="password" 
                    required
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="Enter official ID or badge number"
                  />
                </div>
              </div>
            </>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-4 ${
              role === 'official'
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                : role === 'journalist'
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
            }`}
          >
            {loading ? 'Saving...' : 'Save Profile'} <CheckCircle className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
