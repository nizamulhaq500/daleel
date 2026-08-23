'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, TrendingUp, RefreshCw } from 'lucide-react';

const TRENDING_CASES = [
  {
    id: 'TR-892',
    platform: 'X (Twitter)',
    threat: 'Genocide Dog-Whistle',
    content: 'Mass coordinated reply campaign using "Remove Kebab" memes targeting Muslim politicians in Europe.',
    refutation: 'Identified as coordinated synthetic network. Not organic engagement.'
  },
  {
    id: 'TR-893',
    platform: 'TikTok',
    threat: 'Decontextualized Video',
    content: 'Viral video falsely claiming Muslims are burning a church in France.',
    refutation: 'Video is actually from a 2018 building fire in Egypt. Flagged for false context.'
  },
  {
    id: 'TR-894',
    platform: 'Facebook',
    threat: 'Economic Boycott Conspiracy',
    content: 'Viral groups urging boycott of "Halal certification", claiming it funds terrorism via "Jizya tax".',
    refutation: 'Halal certification is standard food compliance, fully audited. No terror links exist.'
  }
];

export default function NewsTicker() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TRENDING_CASES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-full flex flex-col relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-opacity duration-1000 group-hover:opacity-100 opacity-50"></div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 shadow-inner">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Live Threat Intelligence</h3>
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase mt-1 flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin-slow" /> Network Sync Active
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          {TRENDING_CASES.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-500 ${idx === activeIndex ? 'w-6 bg-emerald-500' : 'w-2 bg-slate-800'}`}
            />
          ))}
        </div>
      </div>

      <div className="relative flex-1">
        {TRENDING_CASES.map((caseData, idx) => (
          <div 
            key={caseData.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out flex flex-col justify-center ${
              idx === activeIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg text-xs font-bold uppercase tracking-wider w-max mb-4">
              <AlertTriangle className="w-3.5 h-3.5" />
              {caseData.threat}
            </div>
            
            <p className="text-xl text-slate-200 font-medium leading-relaxed mb-6">
              "{caseData.content}"
            </p>
            
            <div className="bg-slate-950 border-l-2 border-emerald-500 p-4 rounded-r-xl">
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest block mb-2">Daleel Refutation</span>
              <p className="text-sm text-slate-300 leading-relaxed">{caseData.refutation}</p>
            </div>
            
            <div className="mt-auto pt-6 flex items-center gap-4 text-xs font-bold text-slate-500">
              <span className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5">
                Target: {caseData.platform}
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <Clock className="w-3.5 h-3.5" /> Detected {Math.floor(Math.random() * 12) + 1}m ago
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
