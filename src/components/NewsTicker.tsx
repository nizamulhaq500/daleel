'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Clock, FileText, ExternalLink, RefreshCw } from 'lucide-react';

const EDITORIAL_REPORTS = [
  {
    id: 'REP-1024',
    sourceName: 'European Digital Rights Observatory',
    sourceDate: 'Oct 14, 2025',
    evidenceStatus: 'Verified False Context',
    explanation: 'A viral video claiming to show a church fire in France was fact-checked. Metadata analysis and cross-reference with international news databases confirm the footage depicts a 2018 electrical fire in a completely different region, with synthetically added audio.',
    postUrl: '#'
  },
  {
    id: 'REP-1025',
    sourceName: 'Global Hate Speech Monitor',
    sourceDate: 'Nov 02, 2025',
    evidenceStatus: 'Coordinated Synthetic Network',
    explanation: 'Analysis of recent social media trends indicates a coordinated bot network artificially amplifying sectarian keywords. The campaign utilizes historical dog-whistles recognized by international hate-speech monitoring bodies, aiming to manufacture political outrage.',
    postUrl: '#'
  },
  {
    id: 'REP-1026',
    sourceName: 'Economic Compliance Audit Board',
    sourceDate: 'Jan 19, 2026',
    evidenceStatus: 'Debunked Conspiracy',
    explanation: 'Claims regarding dietary certification funding illicit organizations have been thoroughly reviewed. Multiple global financial task forces and consumer protection agencies confirm these certifications function identically to standard food compliance audits with transparent financial records.',
    postUrl: '#'
  }
];

export default function NewsTicker() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % EDITORIAL_REPORTS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div 
      className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-full flex flex-col relative overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-opacity duration-1000 group-hover:opacity-100 opacity-50"></div>
      
      <div className="relative z-20 flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 shadow-inner">
            <FileText className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Verified Evidence Reports</h3>
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase mt-1 flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin-slow" /> Daily Sync Active
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          {EDITORIAL_REPORTS.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${idx === activeIndex ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-700 hover:bg-slate-400'}`}
              aria-label={`View report ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="relative flex-1">
        {EDITORIAL_REPORTS.map((report, idx) => (
          <div 
            key={report.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out flex flex-col justify-start pt-2 ${
              idx === activeIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'
            }`}
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div>
                <span className="text-sm font-bold text-slate-200 block mb-1">{report.sourceName}</span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {report.sourceDate}
                </span>
              </div>
              <a href={report.postUrl} className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-emerald-400 transition-colors">
                Source Document <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            
            <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs font-bold uppercase tracking-wider mb-4">
                <ShieldCheck className="w-4 h-4" />
                {report.evidenceStatus}
              </div>
              
              <p className="text-[15px] text-slate-300 font-medium leading-relaxed mb-0">
                {report.explanation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
