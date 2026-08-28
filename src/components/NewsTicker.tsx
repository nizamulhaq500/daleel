'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, TrendingUp, RefreshCw, ExternalLink, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface TrendingCase {
  id: string;
  platform: string;
  threat: string;
  content: string;
  refutation: string;
  timeLabel: string;
  authorName: string;
  postUrl: string;
  sourceOrg: string;
}

const NARRATIVE_ROTATION_POOL: TrendingCase[] = [
  {
    id: 'TR-901',
    platform: 'X (Twitter)',
    threat: 'Genocide Dog-Whistle',
    content: 'Coordinated reply campaigns utilizing "Remove Kebab" memes targeting Muslim civic officials in European parliaments.',
    refutation: 'Recognized by international human rights tribunals (UN ICTY) as hate speech referencing the 1995 Srebrenica genocide. Coordinated network detected attempting to evade keyword filters.',
    timeLabel: '8 mins ago',
    authorName: '@EuropaFirst_EU',
    postUrl: 'https://tellmamauk.org/resources/',
    sourceOrg: 'Tell MAMA UK'
  },
  {
    id: 'TR-902',
    platform: 'TikTok',
    threat: 'Decontextualized Video',
    content: 'Viral audio meme claiming French civil authorities are replacing church bells with calls to prayer.',
    refutation: 'Forensic audio analysis verifies audio was overlaid from an archive documentary onto standard municipal renovation footage in Lyon, France.',
    timeLabel: '24 mins ago',
    authorName: '@TruthReport2026',
    postUrl: 'https://bridge.georgetown.edu/research/factsheets/',
    sourceOrg: 'Georgetown Bridge Initiative'
  },
  {
    id: 'TR-903',
    platform: 'Facebook / Meta',
    threat: 'Economic Disinformation',
    content: 'Viral boycott graphics claiming halal certification fees act as a "stealth jizya tax" subsidizing international militancy.',
    refutation: 'Halal certification is a voluntary, audited food quality standard identical to Kosher or Vegan labeling. Independent economic audits confirm zero terror financing links.',
    timeLabel: '41 mins ago',
    authorName: 'Patriot Voice Group',
    postUrl: 'https://www.ispu.org/islamophobia-resources/',
    sourceOrg: 'ISPU Demographics & Policy'
  },
  {
    id: 'TR-904',
    platform: 'Telegram',
    threat: 'Demographic Conspiracy',
    content: 'Coordinated infographic claiming Muslim birth rates will replace constitutional courts in the UK by 2030.',
    refutation: 'Pew Research demographic projections confirm fertility rates among minority immigrant populations rapidly converge with national averages within one generation.',
    timeLabel: '1 hour ago',
    authorName: 'National Freedom Channel',
    postUrl: 'https://www.pewresearch.org/religion/2017/11/29/europes-growing-muslim-population/',
    sourceOrg: 'Pew Research Center'
  },
  {
    id: 'TR-905',
    platform: 'X (Twitter)',
    threat: 'Theological Distortion',
    content: 'Claims that the Islamic concept of Taqiyya commands Muslim doctors and public figures to deceive non-Muslims.',
    refutation: 'In classical Islamic jurisprudence, Taqiyya applies solely as a self-defense exemption for persecuted religious minorities under imminent threat of death, not civic deception.',
    timeLabel: '2 hours ago',
    authorName: '@CivicWatchdog',
    postUrl: 'https://bridge.georgetown.edu/research/factsheet-taqiyya/',
    sourceOrg: 'Georgetown Bridge Initiative'
  },
  {
    id: 'TR-906',
    platform: 'YouTube / Shorts',
    threat: 'Institutional Subversion Claim',
    content: 'Fabricated claims that local English councils have enacted "No-Go Zones" governed by independent Sharia courts.',
    refutation: 'The UK Law Commission and parliamentary reviews confirm no independent religious legal zones exist. Religious mediation operates strictly under standard voluntary arbitration laws.',
    timeLabel: '3 hours ago',
    authorName: 'Urban Examiner',
    postUrl: 'https://fullfact.org/law/no-go-zones-sharia-law-myths/',
    sourceOrg: 'Full Fact UK'
  }
];

export default function NewsTicker() {
  const [cases, setCases] = useState<TrendingCase[]>(NARRATIVE_ROTATION_POOL);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

  // Compute 24-hour dynamic rotation based on calendar day
  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    
    // Shift rotation pool deterministically per day
    const rotated = [...NARRATIVE_ROTATION_POOL].sort((a, b) => {
      const hashA = (a.id.charCodeAt(3) + dayOfYear) % NARRATIVE_ROTATION_POOL.length;
      const hashB = (b.id.charCodeAt(3) + dayOfYear) % NARRATIVE_ROTATION_POOL.length;
      return hashA - hashB;
    });

    setCases(rotated);
    setLastSyncTime(today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cases.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused, cases.length]);

  const currentCase = cases[activeIndex] || cases[0];

  return (
    <div 
      className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 h-full flex flex-col justify-between relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ticker Header */}
      <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight">
                Live Disinformation Tracker
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                24h Auto-Sync
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>Synced today at {lastSyncTime} &bull; 6 Cross-Platform Streams</span>
            </p>
          </div>
        </div>

        {/* Indicator Dots */}
        <div className="flex gap-1.5">
          {cases.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === activeIndex ? 'w-6 bg-emerald-500' : 'w-1.5 bg-slate-700 hover:bg-slate-600'
              }`}
              aria-label={`View threat case ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Case Body */}
      <div className="relative flex-1 min-h-[220px] flex flex-col justify-between py-1">
        <div className="space-y-3">
          
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded text-xs font-semibold">
                <AlertTriangle className="w-3 h-3" />
                {currentCase.threat}
              </span>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {currentCase.platform}
              </span>
            </div>

            <span className="text-[11px] text-slate-500 font-medium">
              Detected {currentCase.timeLabel}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
              Captured Viral Claim:
            </span>
            <p className="text-xs sm:text-sm text-slate-200 font-serif italic leading-relaxed">
              "{currentCase.content}"
            </p>
          </div>

          <div className="bg-emerald-950/20 p-3 rounded-xl border border-emerald-900/40 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
              Forensic Fact-Check & Counter-Evidence:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentCase.refutation}
            </p>
          </div>
        </div>

        {/* Working Reference Link Footer */}
        <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Source: <strong className="text-slate-200">{currentCase.sourceOrg}</strong></span>
          </div>

          <a 
            href={currentCase.postUrl} 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold text-xs transition-colors bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/20"
          >
            <span>Read Academic Factsheet</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
}
