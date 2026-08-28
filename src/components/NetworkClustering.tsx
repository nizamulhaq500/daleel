'use client';

import { useState } from 'react';
import { 
  Layers, 
  Bot, 
  TrendingUp, 
  Share2, 
  Download, 
  Copy, 
  Check, 
  ShieldAlert, 
  Send, 
  Building,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ExternalLink
} from 'lucide-react';

interface AttackCluster {
  id: string;
  name: string;
  botProbability: number;
  platforms: string[];
  reportCount: number;
  sharedSignatures: string[];
  firstDetected: string;
  velocity: string;
  threatLevel: 'Critical' | 'High' | 'Elevated';
  summary: string;
  samplePost: string;
}

const SAMPLE_CLUSTERS: AttackCluster[] = [
  {
    id: 'cluster-halal-01',
    name: 'Coordinated Commercial Halal Boycott & Astroturf Campaign',
    botProbability: 94,
    platforms: ['X (Twitter)', 'TikTok'],
    reportCount: 18,
    sharedSignatures: ['#BoycottHalal', 'economic jihad', 'stealth jizya tax', 'terror fund'],
    firstDetected: '24 hours ago',
    velocity: 'High Velocity (+45 posts/hr)',
    threatLevel: 'High',
    summary: 'Automated network using copy-paste template posts targeting commercial food manufacturers with fabricated claims that certification fees finance extremist groups.',
    samplePost: 'Why is [Brand] forcing halal certification on us? You are paying the stealth jizya tax to fund extremism! #BoycottHalal #EconomicJihad'
  },
  {
    id: 'cluster-replacement-02',
    name: 'Coordinated Demographic Infiltration & Riots Agitation',
    botProbability: 88,
    platforms: ['X (Twitter)', 'Telegram'],
    reportCount: 31,
    sharedSignatures: ['demographic replacement', 'two-tier policing', 'sharia takeover', 'reclaim the west'],
    firstDetected: '48 hours ago',
    velocity: 'Severe Velocity (+110 posts/hr)',
    threatLevel: 'Critical',
    summary: 'Coordinated amplification network repurposing localized crime footage with false claims of Islamic state subversion to incite physical unrest.',
    samplePost: 'The demographic replacement is happening right before our eyes. The government is silent on the creeping Sharia invasion.'
  },
  {
    id: 'cluster-taqiyya-03',
    name: 'Synchronized Civic Engagement Delegitimization Wave',
    botProbability: 79,
    platforms: ['Facebook / Meta', 'X (Twitter)'],
    reportCount: 12,
    sharedSignatures: ['taqiyya master', 'stealth jihadist', 'never trust them'],
    firstDetected: '3 days ago',
    velocity: 'Moderate Velocity (+15 posts/hr)',
    threatLevel: 'Elevated',
    summary: 'Targeted harassment campaign attacking Muslim political candidates and civil society leaders accusing them of deceptive religious subversion.',
    samplePost: 'Do not trust their election promises. They are using Taqiyya to conceal their true intentions for our city councils.'
  }
];

export default function NetworkClustering({ userRole = 'journalist' }: { userRole?: 'journalist' | 'official' }) {
  const [selectedCluster, setSelectedCluster] = useState<AttackCluster>(SAMPLE_CLUSTERS[0]);
  const [copiedTakedown, setCopiedTakedown] = useState(false);
  const [clusterActionSuccess, setClusterActionSuccess] = useState(false);

  const getMultiCaseTakedownNotice = (cluster: AttackCluster) => {
    return `FORMAL NOTICE OF COORINDATED HARASSMENT & ASTROTURF CAMPAIGN
Date: ${new Date().toLocaleDateString()}
Target Platforms: ${cluster.platforms.join(', ')}
Cluster ID: #${cluster.id.toUpperCase()}
Coordinated Bot Probability: ${cluster.botProbability}%

To Platform Trust & Safety / Threat Intelligence Teams:

This notification provides formal intelligence regarding a synchronized, inauthentic behavior campaign detected across your platform.

Evidence & Network Profile:
- Campaign Title: ${cluster.name}
- Total Documented Incidents: ${cluster.reportCount} Verified Reports
- Shared Phrase Signatures: ${cluster.sharedSignatures.join(', ')}
- Inauthentic Coordination Indicators: Identical syntax patterns, synchronized timestamp bursts, and repeat template distribution.

Violations:
- Coordinated Inauthentic Behavior (CIB) & Platform Manipulation
- Hateful Conduct & Targeted Group Harassment

Required Action:
We formally demand network-level de-amplification, automated botnet suspension, and de-indexing of associated hashtags.

Dispatched via Daleel Intelligence Pipeline (daleel.org)`;
  };

  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#c26e27]/10 text-[#c26e27] border border-[#c26e27]/20">
              <Bot className="w-3.5 h-3.5" />
              Coordinated Campaign & Botnet Intelligence
            </span>
            <span className="text-xs text-slate-400">&bull; AI Network Clustering Active</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
            Coordinated Threat Clustering Desk
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Detect synchronized hate speech campaigns, copy-paste botnet networks, and multi-account harassment waves.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Clusters</span>
            <span className="text-base font-bold text-slate-100">{SAMPLE_CLUSTERS.length} Identified</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Case Links</span>
            <span className="text-base font-bold text-emerald-400">61 Linked Reports</span>
          </div>
        </div>
      </div>

      {/* Grid: Clusters List & Cluster Deep-Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cluster Cards */}
        <div className="lg:col-span-5 space-y-3">
          {SAMPLE_CLUSTERS.map((c) => {
            const isSelected = selectedCluster.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => {
                  setSelectedCluster(c);
                  setClusterActionSuccess(false);
                }}
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                  isSelected 
                    ? 'bg-slate-950 border-blue-500/60 shadow-lg shadow-blue-950/20' 
                    : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    c.threatLevel === 'Critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {c.threatLevel} Threat
                  </span>

                  <span className="text-[11px] font-bold text-blue-400 flex items-center gap-1">
                    <Bot className="w-3.5 h-3.5" />
                    {c.botProbability}% Bot Likelihood
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-slate-100 mb-1.5">
                  {c.name}
                </h4>

                <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                  {c.summary}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-900">
                  <span>{c.reportCount} Linked User Submissions</span>
                  <span className="text-blue-400 font-medium">{c.velocity}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Cluster Dossier & Enforcement */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-mono text-blue-400 font-bold uppercase tracking-wider block mb-1">
                Cluster Investigation Brief #{selectedCluster.id.toUpperCase()}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-100">
                {selectedCluster.name}
              </h3>
            </div>

            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl shrink-0">
              <Bot className="w-4 h-4 text-blue-400" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Inauthentic Index</span>
                <span className="text-xs font-bold text-blue-300">{selectedCluster.botProbability}% Coordinated</span>
              </div>
            </div>
          </div>

          {/* Shared Signatures & Slurs */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Synchronized Phrase Signatures & Dog-Whistles:
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedCluster.sharedSignatures.map((sig, idx) => (
                <span key={idx} className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-rose-400">
                  "{sig}"
                </span>
              ))}
            </div>
          </div>

          {/* Sample Synthetic Post */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Sample Captured Bot Template:
            </span>
            <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-3.5 text-xs text-slate-300 italic font-serif leading-relaxed">
              "{selectedCluster.samplePost}"
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {clusterActionSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Cluster #{selectedCluster.id} successfully escalated to National Official Enforcement Registry.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getMultiCaseTakedownNotice(selectedCluster));
                  setCopiedTakedown(true);
                  setTimeout(() => setCopiedTakedown(false), 2500);
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-700"
              >
                {copiedTakedown ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTakedown ? 'Notice Copied!' : 'Copy Multi-Case Takedown Demand'}</span>
              </button>

              <button
                onClick={() => setClusterActionSuccess(true)}
                className="bg-[#c26e27] hover:bg-[#a05417] text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Building className="w-3.5 h-3.5" />
                <span>Escalate Cluster to Official Registry</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
