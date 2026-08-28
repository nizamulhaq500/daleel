'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  HeartHandshake, 
  Phone, 
  ShieldCheck, 
  ExternalLink, 
  Lock, 
  AlertCircle, 
  X, 
  Mail, 
  Globe, 
  CheckCircle2 
} from 'lucide-react';

interface OrganizationResource {
  name: string;
  region: string;
  focus: string;
  phone?: string;
  email?: string;
  website: string;
  services: string[];
}

const RESOURCES: OrganizationResource[] = [
  {
    name: 'CAIR (Council on American-Islamic Relations)',
    region: 'United States (National)',
    focus: 'Civil Rights & Free Legal Defense',
    phone: '+1 (202) 488-8787',
    email: 'info@cair.com',
    website: 'https://www.cair.com/report/',
    services: [
      'Pro-bono legal representation for discrimination and hate crimes',
      'Liaison with FBI and local law enforcement',
      'School, workplace, and public accommodation defense'
    ]
  },
  {
    name: 'Tell MAMA UK (Measuring Anti-Muslim Attacks)',
    region: 'United Kingdom (National)',
    focus: 'Independent Hate Crime Support & Police Liaison',
    phone: '0800 456 1226 / SMS: 0115 707 0007',
    email: 'info@tellmamauk.org',
    website: 'https://tellmamauk.org/submit-a-report/',
    services: [
      'Confidential victim casework and emotional support',
      'Direct liaison with UK Police forces for investigation tracking',
      'Online hate speech de-indexing and digital safety casework'
    ]
  },
  {
    name: 'Muslim Advocates',
    region: 'United States',
    focus: 'National Legal & Impact Litigation',
    email: 'contact@muslimadvocates.org',
    website: 'https://muslimadvocates.org/',
    services: [
      'Constitutional and civil rights impact litigation',
      'Protection against online doxxing and surveillance',
      'Institutional accountability and policy reform'
    ]
  },
  {
    name: 'ISPU (Institute for Social Policy and Understanding)',
    region: 'North America',
    focus: 'Empirical Policy Research & Factual Education',
    website: 'https://www.ispu.org/',
    services: [
      'Peer-reviewed demographic and sociological research',
      'Counter-Islamophobia toolkits for educators and civic leaders',
      'Evidence-based policy briefs for government institutions'
    ]
  }
];

export default function VictimSupportModal({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-[#ffffff] dark:bg-[#0f172a] border border-[#dfd2bf] dark:border-slate-700 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">
                Victim Support & Free Legal Aid Directory
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Verified independent civil rights organizations, legal defense funds, and incident caseworkers.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Emergency Notice */}
        <div className="bg-[#fdf0f0] dark:bg-rose-950/30 border border-[#f8c9c9] dark:border-rose-900/50 rounded-2xl p-4 flex items-start gap-3 text-xs shadow-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#a12323] dark:text-rose-400" />
          <div>
            <strong className="block text-[#a12323] dark:text-rose-200 mb-0.5 font-bold">Imminent Threat of Physical Harm?</strong>
            <span className="text-[#4a1c1c] dark:text-rose-300 leading-relaxed font-medium">If you or someone in your community is in immediate danger of violence, please contact emergency services (911 in US / 999 in UK) first before filing online casework.</span>
          </div>
        </div>

        {/* Resource Cards */}
        <div className="space-y-4">
          {RESOURCES.map((org, idx) => (
            <div 
              key={idx}
              className="bg-[#fdfaf5] dark:bg-slate-950 border border-[#dfd2bf] dark:border-slate-800 rounded-2xl p-5 space-y-3.5 hover:border-[#c26e27]/40 dark:hover:border-slate-700 transition-colors shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-[#1e140d] dark:text-slate-100">{org.name}</h3>
                  <span className="text-[11px] text-emerald-400 font-medium">{org.region} &bull; {org.focus}</span>
                </div>

                <a
                  href={org.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-colors w-max"
                >
                  <span>Submit Casework</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400 pt-1">
                {org.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="text-slate-300 font-mono">{org.phone}</span>
                  </div>
                )}
                {org.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="text-slate-300">{org.email}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-900 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Provided Services:</span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-400">
                  {org.services.map((svc, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{svc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Digital Safety Tips */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            Digital Safety & Harassment Response Checklist:
          </span>
          <ul className="space-y-1 text-slate-400 text-[11px] list-disc list-inside">
            <li><strong>Preserve Full Chain of Custody</strong>: Export your signed Daleel PDF dossier before offensive posts are deleted.</li>
            <li><strong>Lock Down Social Accounts</strong>: Enable Two-Factor Authentication (2FA) via an authenticator app (not SMS).</li>
            <li><strong>Prevent Doxxing</strong>: Audit personal phone numbers and home addresses on data broker sites.</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            Close Directory
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
