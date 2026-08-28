'use client';

import { useState } from 'react';
import { 
  Flame, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowUpRight, 
  Compass, 
  Layers, 
  Share2, 
  ExternalLink,
  Info,
  CheckCircle2,
  BarChart3
} from 'lucide-react';

interface ThreatNarrative {
  id: string;
  title: string;
  category: 'Economic Disinformation' | 'Conspiracy Theory' | 'Theological Distortion' | 'Collective Guilt' | 'Dehumanization';
  severity: 'Critical' | 'High' | 'Elevated';
  velocity24h: string;
  velocityDirection: 'up' | 'down';
  platforms: { name: string; percentage: number }[];
  summary: string;
  academicRefutation: string;
  sourceAuthority: string;
  activeCasesCount: number;
}

const SURGE_NARRATIVES: ThreatNarrative[] = [
  {
    id: 'halal-tax',
    title: 'Halal Certification "Stealth Tax" & Economic Jihad',
    category: 'Economic Disinformation',
    severity: 'High',
    velocity24h: '+42% surge',
    velocityDirection: 'up',
    platforms: [
      { name: 'X (Twitter)', percentage: 55 },
      { name: 'TikTok', percentage: 25 },
      { name: 'Meta', percentage: 20 }
    ],
    summary: 'Viral claims alleging fees paid by consumer brands for halal compliance fund extremist militancy or function as an Islamic tax on non-Muslim shoppers.',
    academicRefutation: 'Halal certification is a voluntary, standard commercial quality-assurance verification identical to Kosher, Vegan, and Organic labels. Certification fees cover food safety auditing; zero evidence links certified food brands to terror financing.',
    sourceAuthority: 'The Bridge Initiative (Georgetown University) & Tell MAMA UK',
    activeCasesCount: 28
  },
  {
    id: 'demographic-replacement',
    title: 'Demographic Replacement & "Eurabia" Infiltration',
    category: 'Conspiracy Theory',
    severity: 'Critical',
    velocity24h: '+68% spike',
    velocityDirection: 'up',
    platforms: [
      { name: 'X (Twitter)', percentage: 60 },
      { name: 'Telegram', percentage: 25 },
      { name: 'YouTube', percentage: 15 }
    ],
    summary: 'Claims that Muslim birth rates or immigration are part of a coordinated plot to replace European and Western legal and cultural majorities.',
    academicRefutation: 'Pew Research demographic studies show Muslim population growth stabilizes across generations in line with standard socio-economic development, with no evidence of coordinated institutional subversion.',
    sourceAuthority: 'Pew Demographics & ISPU Research',
    activeCasesCount: 44
  },
  {
    id: 'taqiyya-trope',
    title: 'Taqiyya Distortion (Inherent Deceit Accusation)',
    category: 'Theological Distortion',
    severity: 'High',
    velocity24h: '+21% steady',
    velocityDirection: 'up',
    platforms: [
      { name: 'X (Twitter)', percentage: 50 },
      { name: 'Meta', percentage: 30 },
      { name: 'Forums', percentage: 20 }
    ],
    summary: 'Distorting the historical minority self-defense doctrine of Taqiyya to claim all Muslim civic participants are religiously mandated to lie to non-Muslims.',
    academicRefutation: 'In classical Islamic jurisprudence, Taqiyya is a narrowly defined permission allowing persecuted religious minorities to conceal faith under imminent threat of execution, analogous to martyrdom exemptions in other world religions.',
    sourceAuthority: 'Oxford Islamic Studies & ISPU Policy Review',
    activeCasesCount: 19
  },
  {
    id: 'stealth-sharia',
    title: 'Stealth Sharia in Western Civil Courts',
    category: 'Conspiracy Theory',
    severity: 'Elevated',
    velocity24h: '+15% steady',
    velocityDirection: 'up',
    platforms: [
      { name: 'Meta', percentage: 45 },
      { name: 'X (Twitter)', percentage: 35 },
      { name: 'TikTok', percentage: 20 }
    ],
    summary: 'Fabrications that commercial voluntary arbitration panels (halal probate or marriage mediation) are secretly replacing constitutional courts.',
    academicRefutation: 'Voluntary religious arbitration tribunals operate strictly within standard secular arbitration acts (such as the UK Arbitration Act 1996 or US FAA), have zero criminal jurisdiction, and are legally subordinate to national constitutional laws.',
    sourceAuthority: 'UK Law Commission & American Bar Association',
    activeCasesCount: 14
  }
];

export default function ThreatHeatmap() {
  const [selectedNarrative, setSelectedNarrative] = useState<ThreatNarrative>(SURGE_NARRATIVES[0]);

  return (
    <section className="w-full bg-[#060910] border-y border-slate-800/80 py-16 px-4 md:px-8 relative z-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Flame className="w-3.5 h-3.5" />
                Live Disinformation Surge Monitor
              </span>
              <span className="text-xs text-slate-400">&bull; Updated Real-Time</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Active Disinformation Narrative Heatmap
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Cross-platform threat intelligence tracking coordinated anti-Muslim tropes, social velocity surges, and academic refutations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#0f172a] border border-slate-800 px-4 py-2.5 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Indexed Clusters</span>
              <span className="text-lg font-bold text-slate-100">4 Monitored</span>
            </div>
            <div className="bg-[#0f172a] border border-slate-800 px-4 py-2.5 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Avg Surge Velocity</span>
              <span className="text-lg font-bold text-rose-400">+36.5% / 24h</span>
            </div>
          </div>
        </div>

        {/* 2-Column Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Surge Cards List */}
          <div className="lg:col-span-6 space-y-3">
            {SURGE_NARRATIVES.map((narrative) => {
              const isSelected = selectedNarrative.id === narrative.id;
              return (
                <div
                  key={narrative.id}
                  onClick={() => setSelectedNarrative(narrative)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected 
                      ? 'bg-[#0f172a] border-emerald-500/50 shadow-lg shadow-emerald-950/20' 
                      : 'bg-[#0b101b] border-slate-800/80 hover:border-slate-700 hover:bg-[#0f172a]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        narrative.severity === 'Critical' 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                          : narrative.severity === 'High'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-[#c26e27]/10 text-[#c26e27] border border-[#c26e27]/20'
                      }`}>
                        {narrative.severity} Threat
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {narrative.category}
                      </span>
                    </div>

                    <span className={`flex items-center gap-1 text-xs font-black px-2.5 py-0.5 rounded-lg border ${
                      narrative.severity === 'Critical'
                        ? 'bg-[#fdf0f0] dark:bg-rose-950/40 text-[#a12323] dark:text-rose-300 border-[#f8c9c9] dark:border-rose-900/50'
                        : 'bg-[#fef6e5] dark:bg-amber-950/40 text-[#93520e] dark:text-amber-300 border-[#fae2b8] dark:border-amber-900/50'
                    }`}>
                      <TrendingUp className="w-3 h-3" />
                      {narrative.velocity24h}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 mb-1.5 leading-snug">
                    {narrative.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {narrative.summary}
                  </p>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/60 text-[11px] text-slate-400">
                    <span>{narrative.activeCasesCount} Active Incident Reports</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      Inspect Forensic Evidence &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Deep-Dive Forensic Dossier */}
          <div className="lg:col-span-6 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6 sticky top-24">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  Cluster Forensic Profile
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-100">
                  {selectedNarrative.title}
                </h3>
              </div>

              <span className={`px-3 py-1 rounded-lg text-xs font-black tracking-wide border shadow-sm ${
                selectedNarrative.severity === 'Critical' 
                  ? 'bg-[#fdf0f0] dark:bg-rose-950/40 text-[#a12323] dark:text-rose-300 border-[#f8c9c9] dark:border-rose-900/50' 
                  : 'bg-[#fef6e5] dark:bg-amber-950/40 text-[#93520e] dark:text-amber-300 border-[#fae2b8] dark:border-amber-900/50'
              }`}>
                {selectedNarrative.velocity24h}
              </span>
            </div>

            {/* Platform Distribution Bar */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Primary Vector Distribution:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {selectedNarrative.platforms.map((p, idx) => (
                  <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 block font-medium">{p.name}</span>
                    <span className="text-sm font-bold text-slate-200 mt-0.5 block">{p.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deconstruction & Academic Fact Sheet */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Academic Factual Reality:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-serif">
                "{selectedNarrative.academicRefutation}"
              </p>
              <div className="pt-2 border-t border-slate-900 text-[11px] text-slate-400">
                Peer-Reviewed Authority: <strong className="text-slate-300">{selectedNarrative.sourceAuthority}</strong>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2">
              <a
                href="#factcheck-studio"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Test Live Fact-Check for This Narrative</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
