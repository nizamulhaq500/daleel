'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, TrendingUp, RefreshCw, ExternalLink, Twitter, Facebook, Video } from 'lucide-react';

const TRENDING_CASES = [
  {
    id: 'TR-892',
    platform: 'X (Twitter)',
    threat: 'Genocide Dog-Whistle',
    content: 'Mass coordinated reply campaign using "Remove Kebab" memes targeting Muslim politicians in Europe.',
    refutation: 'Daleel analysis confirms this is a coordinated synthetic bot network originating from 3 IP clusters. This phrase is recognized by the UN as hate speech linked to the Srebrenica genocide and violates X\'s Violent Speech policy. Not organic engagement.',
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
    refutation: 'Reverse image search and metadata analysis verifies this footage is actually from a 2018 electrical building fire in Egypt. The audio has been digitally altered to add synthetic Arabic chanting. Flagged for False Context.',
    minutesAgo: 8,
    authorName: 'TruthSeeker_Official',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Seeker',
    postUrl: 'https://www.tiktok.com/tag/churchfire'
  },
  {
    id: 'TR-894',
    platform: 'Facebook',
    threat: 'Economic Boycott Conspiracy',
    content: 'Viral groups urging boycott of "Halal certification", claiming it funds terrorism via "Jizya tax".',
    refutation: 'Halal certification is a standard commercial food compliance audit, identical in function to Kosher or Organic certifications. Multiple global financial task forces have thoroughly audited these agencies and confirmed absolutely no financial links to terror networks exist.',
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
      className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-full flex flex-col relative overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-opacity duration-1000 group-hover:opacity-100 opacity-50"></div>
      
      <div className="relative z-20 flex items-center justify-between mb-6">
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
            <button 
              key={idx} 
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${idx === activeIndex ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-700 hover:bg-slate-400'}`}
              aria-label={`View threat ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="relative flex-1">
        {TRENDING_CASES.map((caseData, idx) => (
          <div 
            key={caseData.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out flex flex-col justify-start pt-2 ${
              idx === activeIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg text-xs font-bold uppercase tracking-wider w-max">
                <AlertTriangle className="w-3.5 h-3.5" />
                {caseData.threat}
              </div>
              <a href={caseData.postUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-emerald-400 transition-colors">
                View Source <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center gap-3 mb-4 p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
              <img src={caseData.authorAvatar} alt="Author Avatar" className="w-10 h-10 rounded-full bg-slate-800" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-200">{caseData.authorName}</span>
                  {caseData.platform.includes('Twitter') && <Twitter className="w-3.5 h-3.5 text-blue-400" />}
                  {caseData.platform.includes('TikTok') && <Video className="w-3.5 h-3.5 text-pink-500" />}
                  {caseData.platform.includes('Facebook') && <Facebook className="w-3.5 h-3.5 text-blue-500" />}
                </div>
                <span className="text-xs text-slate-500">{caseData.platform}</span>
              </div>
            </div>
            
            <p className="text-lg text-slate-200 font-medium leading-relaxed mb-6 italic border-l-2 border-slate-700 pl-4">
              "{caseData.content}"
            </p>
            
            <div className="bg-slate-950 border-l-2 border-emerald-500 p-4 rounded-r-xl">
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest block mb-2">Daleel Refutation</span>
              <p className="text-sm text-slate-300 leading-relaxed">{caseData.refutation}</p>
            </div>
            
            <div className="mt-auto pt-6 flex items-center justify-between text-xs font-bold text-slate-500">
              <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" /> Status: Actively Tracked
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <Clock className="w-3.5 h-3.5" /> Detected {caseData.minutesAgo}m ago
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
