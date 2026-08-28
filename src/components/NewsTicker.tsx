'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, TrendingUp, RefreshCw, ExternalLink, Twitter, Facebook, Video } from 'lucide-react';

const TRENDING_CASES = [
  {
    id: 'TR-892',
    platform: 'X (Twitter)',
    threat: 'Genocide Dog-Whistle',
    content: 'Mass coordinated reply campaign using "Remove Kebab" memes targeting Muslim politicians in Europe.',
    refutation: 'Daleel analysis confirms this is a coordinated synthetic network. This phrase is recognized by international human rights monitors as hate speech linked to the Srebrenica genocide and violates standard violent speech policies.',
    minutesAgo: 2,
    authorName: '@EuropaFirst99',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Europa',
    postUrl: 'https://en.wikipedia.org/wiki/Remove_Kebab'
  },
  {
    id: 'TR-893',
    platform: 'TikTok',
    threat: 'Decontextualized Video',
    content: 'Viral video falsely claiming Muslims are burning a church in France.',
    refutation: 'Reverse image search and metadata analysis verifies this footage is actually from a 2018 electrical building fire in Egypt. The audio was digitally altered with synthetic chants to fabricate false context.',
    minutesAgo: 8,
    authorName: 'TruthSeeker_Official',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Seeker',
    postUrl: 'https://www.tiktok.com/tag/churchfire'
  },
  {
    id: 'TR-894',
    platform: 'Facebook',
    threat: 'Economic Conspiracy',
    content: 'Viral groups urging boycott of "Halal certification", claiming it funds terrorism via "Jizya tax".',
    refutation: 'Halal certification is a voluntary commercial food compliance audit, identical in structure to Kosher or Organic certifications. Independent audits by multiple global financial authorities confirm zero terror-financing links.',
    minutesAgo: 14,
    authorName: 'Citizens United Group',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Citizens',
    postUrl: 'https://www.facebook.com/hashtag/halalboycott'
  }
];

export default function NewsTicker() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TRENDING_CASES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div 
      className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 h-full flex flex-col relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 tracking-tight">Live Disinformation Tracker</h3>
            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
              <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin" /> Cross-Platform Monitoring
            </p>
          </div>
        </div>
        <div className="flex gap-1.5">
          {TRENDING_CASES.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${idx === activeIndex ? 'w-6 bg-emerald-500' : 'w-1.5 bg-slate-700 hover:bg-slate-600'}`}
              aria-label={`View threat ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="relative flex-1 min-h-[300px]">
        {TRENDING_CASES.map((caseData, idx) => (
          <div 
            key={caseData.id}
            className={`absolute inset-0 transition-all duration-500 ease-in-out flex flex-col justify-between ${
              idx === activeIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded text-xs font-semibold">
                  <AlertTriangle className="w-3 h-3" />
                  {caseData.threat}
                </span>
                <a href={caseData.postUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors">
                  Reference <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center gap-2.5 mb-3 p-2.5 bg-slate-900/90 rounded-lg border border-slate-800">
                <img src={caseData.authorAvatar} alt="" className="w-7 h-7 rounded-full bg-slate-800" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-200 truncate">{caseData.authorName}</span>
                    {caseData.platform.includes('Twitter') && <Twitter className="w-3 h-3 text-sky-400 shrink-0" />}
                    {caseData.platform.includes('TikTok') && <Video className="w-3 h-3 text-pink-400 shrink-0" />}
                    {caseData.platform.includes('Facebook') && <Facebook className="w-3 h-3 text-blue-400 shrink-0" />}
                  </div>
                  <span className="text-[10px] text-slate-400">{caseData.platform}</span>
                </div>
              </div>
              
              <p className="text-sm text-slate-200 font-medium leading-relaxed mb-3 italic border-l-2 border-slate-700 pl-3">
                "{caseData.content}"
              </p>
              
              <div className="bg-slate-900/90 border-l-2 border-emerald-500 p-3 rounded-r-lg">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">Daleel Finding</span>
                <p className="text-xs text-slate-300 leading-relaxed">{caseData.refutation}</p>
              </div>
            </div>
            
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 mt-2">
              <span className="text-emerald-400/90 font-medium">Actively Cataloged</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> Logged {caseData.minutesAgo}m ago
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
