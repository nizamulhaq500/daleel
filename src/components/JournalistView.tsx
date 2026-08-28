'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Shield, 
  Search, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Download, 
  Eye, 
  X, 
  Check, 
  Copy, 
  Building,
  Calendar,
  Send,
  ListFilter,
  BookOpen
} from 'lucide-react';
import { generateDossierPDF } from '@/lib/pdf-generator';
import ReporterView from './ReporterView';
import SlurLexiconModal from './SlurLexiconModal';
import { Radio, MessageSquareText, FileCode } from 'lucide-react';
import NetworkClustering from './NetworkClustering';
import { Bot } from 'lucide-react';

function formatTimestamp(ts: any): string {
  if (!ts) return 'Recent';
  try {
    if (ts.toDate && typeof ts.toDate === 'function') {
      return ts.toDate().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
    if (ts.seconds) {
      return new Date(ts.seconds * 1000).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
    if (typeof ts === 'string' || typeof ts === 'number') {
      return new Date(ts).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  } catch (e) {
    return 'Recent';
  }
  return 'Recent';
}

export default function JournalistView() {
  const { user, dbUser } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'escalated'>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [portalMode, setPortalMode] = useState<'triage' | 'clusters' | 'intake'>('triage');
  const [slurLexiconOpen, setSlurLexiconOpen] = useState(false);
  const [syndicationFormat, setSyndicationFormat] = useState<'markdown' | 'teleprompter' | 'social'>('markdown');
  const [mounted, setMounted] = useState(false);
  
  // Selected Report for Deep Inspection & Escalation
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [editorialNotes, setEditorialNotes] = useState('');
  const [isEscalating, setIsEscalating] = useState(false);
  const [copiedPressBrief, setCopiedPressBrief] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedReport) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedReport]);

  useEffect(() => {
    try {
      const local = JSON.parse(localStorage.getItem('daleel_local_reports') || '[]');
      if (Array.isArray(local) && local.length > 0) {
        setReports(local);
      }
    } catch (e) {}

    try {
      const q = collection(db, 'reports');
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        try {
          const local = JSON.parse(localStorage.getItem('daleel_local_reports') || '[]');
          const remoteIds = new Set(docs.map(d => d.id));
          const pendingLocal = Array.isArray(local) ? local.filter((l: any) => !remoteIds.has(l.id)) : [];
          const merged = [...pendingLocal, ...docs];
          merged.sort((a: any, b: any) => {
            const timeA = a.timestamp?.seconds || (a.timestamp ? new Date(a.timestamp).getTime() / 1000 : 0);
            const timeB = b.timestamp?.seconds || (b.timestamp ? new Date(b.timestamp).getTime() / 1000 : 0);
            return timeB - timeA;
          });
          setReports(merged);
        } catch (e) {
          setReports(docs);
        }
      }, (err) => {
        console.warn("Journalist view onSnapshot error:", err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Failed to subscribe in JournalistView:", e);
    }
  }, []);

  const filteredReports = reports.filter((r) => {
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'pending' && r.status !== 'escalated') || (statusFilter === 'escalated' && r.status === 'escalated');
    const matchesPlatform = platformFilter === 'all' || r.sourcePlatform?.toLowerCase().includes(platformFilter.toLowerCase());
    const matchesSearch = !searchQuery.trim() || 
      r.content?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.sourcePlatform?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPlatform && matchesSearch;
  });

  const pendingCount = reports.filter(r => r.status !== 'escalated').length;
  const escalatedCount = reports.filter(r => r.status === 'escalated').length;

  const handleEscalate = async () => {
    if (!selectedReport) return;
    setIsEscalating(true);

    try {
      const reportRef = doc(db, 'reports', selectedReport.id);
      await updateDoc(reportRef, {
        status: 'escalated',
        escalatedBy: user?.uid || 'anon-journalist',
        escalatedByName: dbUser?.name || user?.displayName || 'Investigative Journalist',
        escalatedByEmail: user?.email || '',
        escalatedByOrg: dbUser?.organization || 'Independent Fact-Checking Desk',
        editorialNotes: editorialNotes.trim() || 'Verified by independent fact-checking team.',
        escalatedAt: serverTimestamp(),
      });

      setSelectedReport(null);
      setEditorialNotes('');
    } catch (err) {
      console.error('Failed to escalate report:', err);
      alert('Could not update status. Check permissions.');
    } finally {
      setIsEscalating(false);
    }
  };

  const generateJournalistPDF = async (report: any) => {
    try {
      await generateDossierPDF({ role: 'journalist', report: { ...report, editorialNotes } });
    } catch (e) {
      console.error('PDF error:', e);
      alert('Could not compile PDF brief.');
    }
  };

  const getTeleprompterScript = (report: any) => {
    return `[TELEPROMPTER / BROADCAST DESK SCRIPT]
ANCHOR LEAD-IN:
"A new investigative report published today by the Daleel Trust and Safety Network documents an escalating online harassment narrative targeting Muslim communities on ${report.sourcePlatform}."

BACKGROUND & FACT CHECK:
"Independent researchers at The Bridge Initiative and Tell MAMA confirm that the claims circulating in these viral posts—specifically regarding ${report.content?.substring(0, 50) || 'disinformation tropes'}—are completely fabricated."

CLOSING:
"The incident has been cryptographically preserved under Case ID ${report.id.substring(0, 8).toUpperCase()} and forwarded to public authorities for statutory compliance review."`;
  };

  const getSocialThread = (report: any) => {
    return `🚨 INVESTIGATION ALERT: ${report.sourcePlatform} Disinformation Deconstructed

1/3 A verified incident dossier (Case #${report.id.substring(0, 8).toUpperCase()}) has been cataloged by the Daleel Network.
Offending Claim: "${report.content?.substring(0, 80) || 'Documented screenshot'}"

2/3 Factual Reality: ${report.contextExplanation || 'Evidence matches documented hate tropes.'}

3/3 Forensic Chain of Custody SHA-256: ${report.evidenceHash || 'Verified'}
Read the full academic brief at daleel.org`;
  };

  const getPressReleaseMarkdown = (report: any) => {
    return `### INVESTIGATION BRIEF: [${report.sourcePlatform}] Incident #${report.id.substring(0, 8).toUpperCase()}
**Date:** ${new Date().toLocaleDateString()}
**Severity:** ${report.severity || 'High'}
**Verified By:** ${user?.displayName || 'Investigative Fact-Checker'} (${dbUser?.organization || 'Newsroom'})
**Submitted:** ${formatTimestamp(report.timestamp)}

#### 1. Reported Incident
> "${report.content || 'Visual screenshot submission'}"
- Platform: ${report.sourcePlatform}
- Reference URL: ${report.postUrl || 'N/A'}
- SHA-256 Hash: \`${report.evidenceHash || 'Verified'}\`

#### 2. Investigative Finding
${report.contextExplanation || 'This content employs documented anti-Muslim tropes and coded slurs.'}

#### 3. Editorial Notes
${editorialNotes || report.editorialNotes || 'Cross-referenced against Bridge Initiative & Tell MAMA research databases.'}

*Source: Daleel Trust & Safety Pipeline (daleel.org)*`;
  };

  return (
    <div className="w-full min-h-screen bg-[#090d16] text-slate-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Stats Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#c26e27]/10 text-[#c26e27] border border-[#c26e27]/20">
                Journalist & Fact-Check Desk
              </span>
              <span className="text-xs text-slate-400">&bull; Newsroom Verification Queue</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Community Evidence Triage Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Validate community reports, cross-reference platform violations, or file direct investigative evidence.
            </p>
          </div>

          {/* Mode Switcher & Quick Metrics */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center bg-[#0f172a] p-1.5 rounded-xl border border-slate-800">
              <button
                onClick={() => setPortalMode('triage')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  portalMode === 'triage'
                    ? 'bg-[#c26e27] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>Triage Desk</span>
              </button>
              <button
                onClick={() => setPortalMode('clusters')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  portalMode === 'clusters'
                    ? 'bg-[#c26e27] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Botnet Clusters</span>
              </button>
              <button
                onClick={() => setPortalMode('intake')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  portalMode === 'intake'
                    ? 'bg-[#c26e27] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Direct Ingest</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-[#0f172a] border border-slate-800 px-3 py-2 rounded-xl min-w-[90px]">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Pending</span>
                <span className="text-lg font-bold text-amber-400">{pendingCount}</span>
              </div>
              <div className="bg-[#0f172a] border border-slate-800 px-3 py-2 rounded-xl min-w-[90px]">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Forwarded</span>
                <span className="text-lg font-bold text-emerald-400">{escalatedCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CONDITIONAL BODY: DIRECT INTAKE vs TRIAGE DESK */}
        {portalMode === 'intake' ? (
          <div className="pt-2">
            <ReporterView portalRole="journalist" />
          </div>
        ) : portalMode === 'clusters' ? (
          <div className="pt-2">
            <NetworkClustering userRole="journalist" />
          </div>
        ) : (
          <>
            {/* Filter & Search Bar */}
            <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by keywords, slurs, report ID, or platform..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#c26e27]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSlurLexiconOpen(true)}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#c26e27]/10 hover:bg-[#c26e27]/20 text-[#c26e27] border border-[#c26e27]/30 transition-all flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#c26e27]" />
                <span>Slur Lexicon</span>
              </button>
                {/* Status Filter */}
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${statusFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                  >
                    All ({reports.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('pending')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${statusFilter === 'pending' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400'}`}
                  >
                    Pending ({pendingCount})
                  </button>
                  <button
                    onClick={() => setStatusFilter('escalated')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${statusFilter === 'escalated' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'}`}
                  >
                    Escalated ({escalatedCount})
                  </button>
                </div>

                {/* Platform Filter */}
                <select
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-[#c26e27]"
                >
                  <option value="all">All Platforms</option>
                  <option value="X (Twitter)">X (Twitter)</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Facebook">Facebook / Meta</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Telegram">Telegram</option>
                </select>
              </div>
            </div>

            {/* Triage Queue List */}
            <div className="space-y-4">
              {filteredReports.length === 0 ? (
                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-sm">
                  No reports matching your active filters.
                </div>
              ) : (
                filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-[#0f172a] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group"
                  >
                    <div className="space-y-2 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-[#c26e27]">
                          #{report.id.substring(0, 8).toUpperCase()}
                        </span>
                        <span className="text-slate-700">&bull;</span>
                        <span className="text-xs font-semibold text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {report.sourcePlatform || 'Social Media'}
                        </span>
                        <span className="text-slate-700">&bull;</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          report.severity === 'Critical'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {report.severity || 'High'} Severity
                        </span>
                        <span className="text-slate-700">&bull;</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          report.status === 'escalated'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {report.status === 'escalated' ? 'Escalated to Official' : 'Awaiting Review'}
                        </span>

                        {/* Timestamp Tag */}
                        <span className="text-slate-700">&bull;</span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {formatTimestamp(report.timestamp)}
                        </span>
                      </div>

                      <p className="text-sm text-slate-200 font-medium leading-relaxed line-clamp-2">
                        "{report.content || 'Attached visual evidence without text'}"
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                        <span>Reporter: <strong>{report.reporterName || 'Community Witness'}</strong></span>
                        {report.evidenceHash && (
                          <span className="font-mono text-[10px] text-slate-500">
                            Hash: {report.evidenceHash.substring(0, 16)}...
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setEditorialNotes(report.editorialNotes || '');
                        }}
                        className="px-4 py-2 bg-[#c26e27] hover:bg-[#a05417] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect & Validate</span>
                      </button>

                      <button
                        onClick={() => generateJournalistPDF(report)}
                        className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs rounded-xl transition-colors flex items-center gap-1.5"
                        title="Export PDF Brief"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Brief</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

      </div>

      {/* DEEP-DIVE INSPECTION & ESCALATION MODAL (Mounted via Portal directly to body) */}
      <SlurLexiconModal isOpen={slurLexiconOpen} onClose={() => setSlurLexiconOpen(false)} />

      {selectedReport && mounted && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setSelectedReport(null)}
        >
          <div 
            className="bg-[#0f172a] border border-slate-700 rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono text-[#c26e27] font-bold">
                    CASE DOSSIER #{selectedReport.id.toUpperCase()}
                  </span>
                  <span className="text-slate-600">&bull;</span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {formatTimestamp(selectedReport.timestamp)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100">
                  Incident Verification & Escalation Desk
                </h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Case Details */}
            <div className="space-y-4 text-xs sm:text-sm">
              
              {/* Original Content & Screenshot */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                  <span>Source Platform: <strong>{selectedReport.sourcePlatform}</strong></span>
                  <span>URL: {selectedReport.postUrl ? <a href={selectedReport.postUrl} target="_blank" rel="noreferrer" className="text-[#c26e27] hover:underline">{selectedReport.postUrl}</a> : 'Not provided'}</span>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg text-slate-200 italic font-serif text-sm">
                  "{selectedReport.content || 'No text content provided.'}"
                </div>

                {selectedReport.imageBase64 && (
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Preserved Visual Evidence:</span>
                    <img src={selectedReport.imageBase64} alt="Evidence" className="w-full max-h-64 object-cover rounded-lg border border-slate-800" />
                  </div>
                )}
              </div>

              {/* Forensic Deconstruction */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#c26e27] block">
                  Identified Coded Tropes & Academic Fact Check
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedReport.contextExplanation || 'Evidence matches documented Islamophobic dog-whistles.'}
                </p>
              </div>

              {/* Editorial Notes Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Journalist Editorial Assessment & Newsroom Notes:
                </label>
                <textarea
                  value={editorialNotes}
                  onChange={(e) => setEditorialNotes(e.target.value)}
                  placeholder="Add your verified newsroom findings, cross-case patterns, or notes for law enforcement/platform moderators..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#c26e27]"
                />
              </div>

              {/* Export Press Brief Toolbar */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs text-slate-300 font-bold uppercase tracking-wider">
                    Newsroom Multi-Format Syndication Desk:
                  </span>
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
                    <button
                      onClick={() => setSyndicationFormat('markdown')}
                      className={`px-2.5 py-1 rounded transition-colors ${syndicationFormat === 'markdown' ? 'bg-[#c26e27] text-white' : 'text-slate-400'}`}
                    >
                      Substack / MD
                    </button>
                    <button
                      onClick={() => setSyndicationFormat('teleprompter')}
                      className={`px-2.5 py-1 rounded transition-colors ${syndicationFormat === 'teleprompter' ? 'bg-[#c26e27] text-white' : 'text-slate-400'}`}
                    >
                      Broadcast Script
                    </button>
                    <button
                      onClick={() => setSyndicationFormat('social')}
                      className={`px-2.5 py-1 rounded transition-colors ${syndicationFormat === 'social' ? 'bg-[#c26e27] text-white' : 'text-slate-400'}`}
                    >
                      Social Thread
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => {
                      const text = syndicationFormat === 'markdown' 
                        ? getPressReleaseMarkdown(selectedReport)
                        : syndicationFormat === 'teleprompter'
                        ? getTeleprompterScript(selectedReport)
                        : getSocialThread(selectedReport);
                      navigator.clipboard.writeText(text);
                      setCopiedPressBrief(true);
                      setTimeout(() => setCopiedPressBrief(false), 2000);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-700"
                  >
                    {copiedPressBrief ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPressBrief ? 'Copied to Clipboard!' : `Copy ${syndicationFormat.toUpperCase()} Format`}</span>
                  </button>

                  <button
                    onClick={() => generateJournalistPDF(selectedReport)}
                    className="px-3 py-1.5 bg-[#c26e27]/15 hover:bg-[#c26e27]/25 text-[#c26e27] border border-[#c26e27]/30 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Certified PDF Brief</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Action Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-500">
                Logged in as <strong>{user?.displayName || user?.email}</strong> ({dbUser?.organization || 'Investigative Desk'})
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleEscalate}
                  disabled={isEscalating}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-[#c26e27] hover:bg-[#a05417] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>{isEscalating ? 'Escalating...' : 'Escalate to Official / Legal Queue'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
