import React, { useState } from 'react';
import { Scale, Clock } from 'lucide-react';

interface PlatformMetric {
  name: string;
  grade: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  responseRate: number;
  avgResponseHours: number;
  totalNoticesServed: number;
  resolvedCount: number;
  cibEnforcement: string;
  primaryIssue: string;
}

const PLATFORM_METRICS: PlatformMetric[] = [
  {
    name: 'YouTube',
    grade: 'B+',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
    badgeBorder: 'border-emerald-500/20',
    responseRate: 78,
    avgResponseHours: 21,
    totalNoticesServed: 142,
    resolvedCount: 111,
    cibEnforcement: 'Automated + Human Triage',
    primaryIssue: 'Algorithmic recommendation of long-form anti-Muslim historical revisionism videos in autoplay queues.'
  },
  {
    name: 'TikTok',
    grade: 'B',
    badgeBg: 'bg-sky-500/10',
    badgeText: 'text-sky-600 dark:text-sky-400',
    badgeBorder: 'border-sky-500/20',
    responseRate: 72,
    avgResponseHours: 18,
    totalNoticesServed: 210,
    resolvedCount: 151,
    cibEnforcement: 'Audio Hash Censorship',
    primaryIssue: 'Rapid spread of micro-targeted soundbites with coded hate tropes evading standard keyword filters.'
  },
  {
    name: 'Facebook & Instagram (Meta)',
    grade: 'C+',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-600 dark:text-amber-400',
    badgeBorder: 'border-amber-500/20',
    responseRate: 64,
    avgResponseHours: 34,
    totalNoticesServed: 315,
    resolvedCount: 201,
    cibEnforcement: 'Mixed / Delayed',
    primaryIssue: 'Cross-platform extremist coordination groups operating under innocuous civic or neighbourhood titles.'
  },
  {
    name: 'X (Twitter)',
    grade: 'D-',
    badgeBg: 'bg-rose-500/10',
    badgeText: 'text-rose-600 dark:text-rose-400',
    badgeBorder: 'border-rose-500/20',
    responseRate: 29,
    avgResponseHours: 68,
    totalNoticesServed: 480,
    resolvedCount: 139,
    cibEnforcement: 'Minimal',
    primaryIssue: 'Verified badge amplification of algorithmic hate speech and lack of human trust & safety review desks.'
  },
  {
    name: 'Telegram',
    grade: 'F',
    badgeBg: 'bg-rose-500/10',
    badgeText: 'text-rose-600 dark:text-rose-400',
    badgeBorder: 'border-rose-500/20',
    responseRate: 11,
    avgResponseHours: 120,
    totalNoticesServed: 190,
    resolvedCount: 21,
    cibEnforcement: 'Non-Responsive',
    primaryIssue: 'Complete lack of responsiveness to statutory civil notices; primary staging ground for extremist coordination.'
  }
];

export default function PlatformScorecard() {
  const [timeWindow, setTimeWindow] = useState<'30d' | '90d' | 'all'>('30d');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformMetric>(PLATFORM_METRICS[0]);

  return (
    <div className="scorecard-container border rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#dfd2bf] dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
              <Scale className="w-3.5 h-3.5 text-amber-600" />
              STATUTORY PLATFORM TRANSPARENCY REPORT
            </span>
            <span className="text-xs scorecard-text-muted font-semibold">&bull; Updated Monthly</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold scorecard-text-title tracking-tight">
            Platform Compliance & Response Scorecard
          </h2>
          <p className="text-xs sm:text-sm scorecard-text-sub font-medium mt-1">
            Auditing social platform responsiveness to verified legal notices and hate speech takedown demands.
          </p>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center scorecard-box p-1 rounded-xl border text-xs shrink-0">
          <button
            onClick={() => setTimeWindow('30d')}
            className={"px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer " + (
              timeWindow === '30d' 
                ? 'bg-[#c26e27] dark:bg-emerald-600 text-white shadow-sm' 
                : 'scorecard-text-sub hover:opacity-80'
            )}
          >
            Past 30 Days
          </button>
          <button
            onClick={() => setTimeWindow('90d')}
            className={"px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer " + (
              timeWindow === '90d' 
                ? 'bg-[#c26e27] dark:bg-emerald-600 text-white shadow-sm' 
                : 'scorecard-text-sub hover:opacity-80'
            )}
          >
            Past 90 Days
          </button>
          <button
            onClick={() => setTimeWindow('all')}
            className={"px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer " + (
              timeWindow === 'all' 
                ? 'bg-[#c26e27] dark:bg-emerald-600 text-white shadow-sm' 
                : 'scorecard-text-sub hover:opacity-80'
            )}
          >
            All-Time Audit
          </button>
        </div>
      </div>

      {/* Grid: Platform List & Deep-Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Platforms List */}
        <div className="lg:col-span-7 space-y-3.5">
          {PLATFORM_METRICS.map((p) => {
            const isSelected = selectedPlatform.name === p.name;
            return (
              <div
                key={p.name}
                onClick={() => setSelectedPlatform(p)}
                className={"p-4 sm:p-5 rounded-2xl cursor-pointer transition-all border " + (
                  isSelected 
                    ? 'scorecard-card-selected shadow-md ring-2 ring-[#c26e27]/20 dark:ring-emerald-500/20' 
                    : 'scorecard-card hover:border-[#c26e27]/50 shadow-sm'
                )}
              >
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <span className={"w-10 h-10 rounded-xl font-black text-sm flex items-center justify-center border font-mono shadow-sm " + p.badgeBg + " " + p.badgeText + " " + p.badgeBorder}>
                      {p.grade}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm sm:text-base font-extrabold scorecard-text-title">{p.name}</h4>
                        {isSelected && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#c26e27] dark:bg-emerald-600 text-white">
                            Inspecting
                          </span>
                        )}
                      </div>
                      <span className="text-xs scorecard-text-sub font-semibold block mt-0.5">
                        {p.totalNoticesServed} Legal Notices Served &bull; {p.resolvedCount} Enforced
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-black scorecard-text-title block">{p.responseRate}% Rate</span>
                    <span className="text-xs scorecard-text-muted font-semibold flex items-center gap-1 justify-end mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-[#8c7662] dark:text-slate-400" />
                      {p.avgResponseHours}h latency
                    </span>
                  </div>
                </div>

                {/* Progress Bar Track */}
                <div className="w-full bg-[#ebdccb] dark:bg-slate-900 rounded-full h-2.5 overflow-hidden border border-[#dfd2bf] dark:border-slate-800">
                  <div 
                    className={"h-full rounded-full transition-all duration-300 " + (
                      p.responseRate >= 70 ? 'bg-emerald-500' :
                      p.responseRate >= 50 ? 'bg-amber-500' :
                      'bg-rose-500'
                    )}
                    style={{ width: p.responseRate + '%' }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Platform Detail Dossier */}
        <div className="lg:col-span-5 scorecard-card border rounded-2xl p-6 sm:p-7 space-y-6 shadow-sm sticky top-24">
          
          <div className="flex items-center justify-between pb-4 border-b border-[#dfd2bf] dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className={"w-11 h-11 rounded-xl font-black text-base flex items-center justify-center border font-mono shadow-sm " + selectedPlatform.badgeBg + " " + selectedPlatform.badgeText + " " + selectedPlatform.badgeBorder}>
                {selectedPlatform.grade}
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold scorecard-text-title">{selectedPlatform.name}</h3>
                <span className="text-xs scorecard-text-sub font-semibold">Statutory Compliance Profile</span>
              </div>
            </div>

            <span className={"text-xs font-black px-2.5 py-1 rounded-lg border shadow-sm " + selectedPlatform.badgeBg + " " + selectedPlatform.badgeText + " " + selectedPlatform.badgeBorder}>
              Grade {selectedPlatform.grade}
            </span>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="scorecard-box p-3.5 rounded-xl border text-center">
              <span className="text-[10px] scorecard-text-muted uppercase font-extrabold block">Takedown Success</span>
              <span className="text-2xl font-black scorecard-text-title mt-0.5 block">{selectedPlatform.responseRate}%</span>
            </div>
            <div className="scorecard-box p-3.5 rounded-xl border text-center">
              <span className="text-[10px] scorecard-text-muted uppercase font-extrabold block">Average Latency</span>
              <span className="text-2xl font-black scorecard-text-title mt-0.5 block">{selectedPlatform.avgResponseHours}h</span>
            </div>
          </div>

          {/* Primary Obstacle / Bottleneck */}
          <div className="bg-[#fdf0f0] dark:bg-rose-950/20 p-4 rounded-xl border border-[#f8c9c9] dark:border-rose-900/40 space-y-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#a12323] dark:text-rose-400 block">
              Primary Moderation Bottleneck:
            </span>
            <p className="text-xs text-[#2e1f14] dark:text-slate-300 leading-relaxed font-sans font-medium">
              {selectedPlatform.primaryIssue}
            </p>
          </div>

          {/* Legal Compliance Status Box */}
          <div className="p-3.5 bg-[#eaf2ed] dark:bg-emerald-950/20 border border-[#cce0d4] dark:border-emerald-900/40 rounded-xl text-xs space-y-2 text-[#1b2d23] dark:text-slate-300 font-semibold">
            <div className="flex items-center justify-between">
              <span className="text-[#3b5547] dark:text-slate-400 font-semibold">EU DSA Art. 16 Status:</span>
              <strong className={selectedPlatform.responseRate >= 60 ? 'text-[#13633d] dark:text-emerald-400 font-black' : 'text-[#a12323] dark:text-rose-400 font-black'}>
                {selectedPlatform.responseRate >= 60 ? 'Compliant' : 'Audit Triggered'}
              </strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#3b5547] dark:text-slate-400 font-semibold">Botnet Manipulation Action:</span>
              <strong className="text-[#1b2d23] dark:text-slate-200 font-black">{selectedPlatform.cibEnforcement}</strong>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
