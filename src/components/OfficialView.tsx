'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Building, 
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
  Scale, 
  Gavel, 
  Calendar,
  ShieldCheck,
  Send,
  ListFilter
} from 'lucide-react';
import { generateDossierPDF } from '@/lib/pdf-generator';
import ReporterView from './ReporterView';

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

export default function OfficialView() {
  const { user, dbUser } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [stageFilter, setStageFilter] = useState<'all' | 'escalated' | 'takedown_requested' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [portalMode, setPortalMode] = useState<'enforcement' | 'intake'>('enforcement');
  const [mounted, setMounted] = useState(false);
  
  // Selected Case for Official Action
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [copiedLegalMemo, setCopiedLegalMemo] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedCase) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedCase]);

  useEffect(() => {
    const q = collection(db, 'reports');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      const officialDocs = docs.filter((d: any) => d.status === 'escalated' || d.status === 'takedown_requested' || d.status === 'resolved');
      officialDocs.sort((a: any, b: any) => {
        const timeA = a.timestamp?.seconds || 0;
        const timeB = b.timestamp?.seconds || 0;
        return timeB - timeA;
      });
      setReports(officialDocs);
    });
    return () => unsubscribe();
  }, []);

  const filteredReports = reports.filter((r) => {
    const matchesStage = stageFilter === 'all' || r.status === stageFilter;
    const matchesSearch = !searchQuery.trim() || 
      r.content?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.sourcePlatform?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const underReviewCount = reports.filter(r => r.status === 'escalated').length;
  const takedownCount = reports.filter(r => r.status === 'takedown_requested').length;
  const resolvedCount = reports.filter(r => r.status === 'resolved').length;

  const handleUpdateStatus = async (newStatus: 'takedown_requested' | 'resolved' | 'escalated') => {
    if (!selectedCase) return;
    setIsUpdating(true);

    try {
      const caseRef = doc(db, 'reports', selectedCase.id);
      await updateDoc(caseRef, {
        status: newStatus,
        officialActionBy: user?.uid || 'official',
        officialActionByName: dbUser?.name || user?.displayName || 'Enforcement Official',
        officialActionByDept: dbUser?.department || dbUser?.organization || 'Civil Rights Division',
        resolutionNote: resolutionNote.trim() || selectedCase.resolutionNote || 'Status updated by official authority.',
        actionTakenAt: serverTimestamp(),
      });

      setSelectedCase(null);
      setResolutionNote('');
    } catch (err) {
      console.error('Failed to update case status:', err);
      alert('Could not update status. Check permissions.');
    } finally {
      setIsUpdating(false);
    }
  };

  const generateOfficialPDF = async (report: any) => {
    try {
      await generateDossierPDF({ role: 'official', report });
    } catch (e) {
      console.error('PDF error:', e);
      alert('Could not compile official PDF dossier.');
    }
  };

  const getLegalTakedownMemo = (report: any) => {
    return `OFFICIAL LEGAL NOTICE & TAKEDOWN DEMAND
To: ${report.sourcePlatform} Trust, Safety & Compliance Division
Date: ${new Date().toLocaleDateString()}
Case Ref: #${report.id.toUpperCase()}

RE: Urgent Request for Removal of Unlawful Hate Speech & Targeted Incitement

Pursuant to applicable statutory online safety frameworks (including EU Digital Services Act Article 16, UK Online Safety Act, and standard Platform Terms of Service), this office has received and verified formal evidence regarding the following publication:

1. Offending Material:
- Source Platform: ${report.sourcePlatform}
- Reference URL: ${report.postUrl || 'Uploaded in dossier'}
- Preserved Content: "${report.content || 'Visual screenshot'}"
- Tamper-Evident SHA-256 Hash: ${report.evidenceHash || 'Verified'}
- Submitted Date: ${formatTimestamp(report.timestamp)}

2. Finding of Unlawfulness & Policy Violation:
${report.contextExplanation || 'Content employs documented hate tropes and incitement.'}

3. Required Action:
We formally demand the immediate de-indexing, geoblocking, or removal of this offending content within 24 hours of receipt.

Certified by:
${user?.displayName || 'Enforcement Officer'}, ${dbUser?.department || 'Civil Rights & Online Safety Authority'}
Daleel Trust & Safety Repository (daleel.org)`;
  };

  return (
    <div className="w-full min-h-screen bg-[#090d16] text-slate-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Metrics Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Official & Legal Authority Console
              </span>
              <span className="text-xs text-slate-400">&bull; Statutory Compliance Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Evidence Enforcement Command
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Ingest journalist-verified dossiers, issue formal platform takedown demands, or ingest direct agency evidence.
            </p>
          </div>

          {/* Mode Switcher & Quick Metrics */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center bg-[#0f172a] p-1.5 rounded-xl border border-slate-800">
              <button
                onClick={() => setPortalMode('enforcement')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  portalMode === 'enforcement'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>Case Command</span>
              </button>
              <button
                onClick={() => setPortalMode('intake')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  portalMode === 'intake'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Direct Ingest</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-[#0f172a] border border-slate-800 px-3 py-2 rounded-xl min-w-[80px]">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Pending</span>
                <span className="text-lg font-bold text-amber-400">{underReviewCount}</span>
              </div>
              <div className="bg-[#0f172a] border border-slate-800 px-3 py-2 rounded-xl min-w-[80px]">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Takedowns</span>
                <span className="text-lg font-bold text-blue-400">{takedownCount}</span>
              </div>
              <div className="bg-[#0f172a] border border-slate-800 px-3 py-2 rounded-xl min-w-[80px]">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Resolved</span>
                <span className="text-lg font-bold text-emerald-400">{resolvedCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CONDITIONAL BODY: DIRECT INTAKE vs CASE COMMAND */}
        {portalMode === 'intake' ? (
          <div className="pt-2">
            <ReporterView portalRole="official" />
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
                  placeholder="Search by case ID, platform, or keywords..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs shrink-0">
                <button
                  onClick={() => setStageFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${stageFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                >
                  All ({reports.length})
                </button>
                <button
                  onClick={() => setStageFilter('escalated')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${stageFilter === 'escalated' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400'}`}
                >
                  Pending ({underReviewCount})
                </button>
                <button
                  onClick={() => setStageFilter('takedown_requested')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${stageFilter === 'takedown_requested' ? 'bg-blue-500/20 text-blue-300' : 'text-slate-400'}`}
                >
                  Takedowns ({takedownCount})
                </button>
                <button
                  onClick={() => setStageFilter('resolved')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${stageFilter === 'resolved' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'}`}
                >
                  Resolved ({resolvedCount})
                </button>
              </div>
            </div>

            {/* Case Queue List */}
            <div className="space-y-4">
              {filteredReports.length === 0 ? (
                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-sm">
                  No escalated legal cases matching your active filter.
                </div>
              ) : (
                filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-[#0f172a] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group"
                  >
                    <div className="space-y-2 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-amber-400">
                          CASE #{report.id.substring(0, 8).toUpperCase()}
                        </span>
                        <span className="text-slate-700">&bull;</span>
                        <span className="text-xs font-semibold text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {report.sourcePlatform || 'Social Media'}
                        </span>
                        <span className="text-slate-700">&bull;</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          report.status === 'resolved'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : report.status === 'takedown_requested'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {report.status === 'resolved' ? 'Enforced & Resolved' : report.status === 'takedown_requested' ? 'Takedown Demand Issued' : 'Verified by Journalist'}
                        </span>
                        
                        {/* Timestamp Tag */}
                        <span className="text-slate-700">&bull;</span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {report.escalatedAt ? formatTimestamp(report.escalatedAt) : formatTimestamp(report.timestamp)}
                        </span>
                      </div>

                      <p className="text-sm text-slate-200 font-medium leading-relaxed line-clamp-2">
                        "{report.content || 'Attached visual evidence without text'}"
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                        <span>Journalist Validator: <strong>{report.escalatedByName || 'Newsroom Fact-Checker'}</strong> ({report.escalatedByOrg || 'Investigative Desk'})</span>
                        {report.resolutionNote && (
                          <span className="text-emerald-400 font-medium truncate max-w-md">
                            Outcome: {report.resolutionNote}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                      <button
                        onClick={() => {
                          setSelectedCase(report);
                          setResolutionNote(report.resolutionNote || '');
                        }}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Gavel className="w-3.5 h-3.5" />
                        <span>Enforce Action</span>
                      </button>

                      <button
                        onClick={() => generateOfficialPDF(report)}
                        className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs rounded-xl transition-colors flex items-center gap-1.5"
                        title="Export Official Dossier"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Dossier</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

      </div>

      {/* ENFORCEMENT & LEGAL ACTION MODAL (Mounted via Portal directly to body) */}
      {selectedCase && mounted && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setSelectedCase(null)}
        >
          <div 
            className="bg-[#0f172a] border border-slate-700 rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono text-amber-400 font-bold">
                    LEGAL DOSSIER #{selectedCase.id.toUpperCase()}
                  </span>
                  <span className="text-slate-600">&bull;</span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {formatTimestamp(selectedCase.timestamp)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100">
                  Platform Compliance & Enforcement Action Desk
                </h3>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Case Details */}
            <div className="space-y-4 text-xs sm:text-sm">
              
              {/* Evidence & Journalist Stamp */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                  <span>Platform: <strong>{selectedCase.sourcePlatform}</strong></span>
                  <span>Verifying Newsroom: <strong>{selectedCase.escalatedByOrg || 'Journalist Hub'}</strong></span>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg text-slate-200 italic font-serif text-sm">
                  "{selectedCase.content || 'Visual screenshot evidence'}"
                </div>

                {selectedCase.imageBase64 && (
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Preserved Visual Evidence:</span>
                    <img src={selectedCase.imageBase64} alt="Evidence" className="w-full max-h-64 object-cover rounded-lg border border-slate-800" />
                  </div>
                )}

                {selectedCase.editorialNotes && (
                  <div className="p-3 bg-blue-950/20 border border-blue-900/40 rounded-lg text-blue-300 text-xs">
                    <strong>Journalist's Verification Notes:</strong> {selectedCase.editorialNotes}
                  </div>
                )}
              </div>

              {/* Legal Takedown Demand Generator */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Statutory Takedown Notice & Legal Memo
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(getLegalTakedownMemo(selectedCase));
                      setCopiedLegalMemo(true);
                      setTimeout(() => setCopiedLegalMemo(false), 2000);
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors flex items-center gap-1"
                  >
                    {copiedLegalMemo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLegalMemo ? 'Copied Legal Notice' : 'Copy Legal Memo'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pre-formatted formal legal notice citing EU Digital Services Act Art 16 and standard Hate Speech statutes for platform trust & safety submission.
                </p>
              </div>

              {/* Official Action & Resolution Note */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Official Action / Platform Resolution Note:
                </label>
                <textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Record platform response or legal referral (e.g. 'Formal takedown notice transmitted to X Safety; offending post removed by platform on Aug 28')..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => generateOfficialPDF(selectedCase)}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 w-full sm:w-auto justify-center"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Certified PDF</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleUpdateStatus('takedown_requested')}
                  disabled={isUpdating}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  Mark Takedown Issued
                </button>

                <button
                  onClick={() => handleUpdateStatus('resolved')}
                  disabled={isUpdating}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  Mark Enforced / Resolved
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
