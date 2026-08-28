'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Shield, 
  Search, 
  Filter, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Download, 
  ArrowRight, 
  ExternalLink, 
  Eye, 
  X, 
  Send, 
  Check, 
  Copy, 
  Layers, 
  BookOpen,
  MessageSquare,
  Building,
  User
} from 'lucide-react';
import { generateDossierPDF } from '@/lib/pdf-generator';

export default function JournalistView() {
  const { user, dbUser } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'escalated'>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected Report for Deep Inspection & Escalation
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [editorialNotes, setEditorialNotes] = useState('');
  const [isEscalating, setIsEscalating] = useState(false);
  const [copiedPressBrief, setCopiedPressBrief] = useState(false);

  useEffect(() => {
    const q = collection(db, 'reports');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort newest first
      docs.sort((a: any, b: any) => {
        const timeA = a.timestamp?.seconds || 0;
        const timeB = b.timestamp?.seconds || 0;
        return timeB - timeA;
      });
      setReports(docs);
    });
    return () => unsubscribe();
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

  const getPressReleaseMarkdown = (report: any) => {
    return `### INVESTIGATION BRIEF: [${report.sourcePlatform}] Incident #${report.id.substring(0, 8).toUpperCase()}
**Date:** ${new Date().toLocaleDateString()}
**Severity:** ${report.severity || 'High'}
**Verified By:** ${user?.displayName || 'Investigative Fact-Checker'} (${dbUser?.organization || 'Newsroom'})

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
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Journalist & Fact-Check Desk
              </span>
              <span className="text-xs text-slate-400">&bull; Newsroom Verification Queue</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Community Evidence Triage Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Validate community reports, cross-reference platform violations, and package verified briefs for public authorities.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="bg-[#0f172a] border border-slate-800 p-3 rounded-xl min-w-[120px]">
              <span className="text-[11px] text-slate-400 font-semibold block uppercase">Pending Triage</span>
              <span className="text-xl font-bold text-amber-400">{pendingCount}</span>
            </div>
            <div className="bg-[#0f172a] border border-slate-800 p-3 rounded-xl min-w-[120px]">
              <span className="text-[11px] text-slate-400 font-semibold block uppercase">Forwarded to Officials</span>
              <span className="text-xl font-bold text-emerald-400">{escalatedCount}</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, slurs, report ID, or platform..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
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
                    <span className="text-[11px] font-mono font-bold text-blue-400">
                      #{report.id.substring(0, 8).toUpperCase()}
                    </span>
                    <span className="text-slate-700">&bull;</span>
                    <span className="text-xs font-semibold text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
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
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
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

      </div>

      {/* DEEP-DIVE INSPECTION & ESCALATION MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono text-blue-400 font-bold block mb-1">
                  CASE DOSSIER #{selectedReport.id.toUpperCase()}
                </span>
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
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Source Platform: <strong>{selectedReport.sourcePlatform}</strong></span>
                  <span>URL: {selectedReport.postUrl ? <a href={selectedReport.postUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{selectedReport.postUrl}</a> : 'Not provided'}</span>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg text-slate-200 italic font-serif text-sm">
                  "{selectedReport.content || 'No text content provided.'}"
                </div>

                {selectedReport.imageBase64 && (
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Preserved Screenshot Evidence:</span>
                    <img src={selectedReport.imageBase64} alt="Evidence" className="w-full max-h-64 object-cover rounded-lg border border-slate-800" />
                  </div>
                )}
              </div>

              {/* Forensic Deconstruction */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block">
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
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Export Press Brief Toolbar */}
              <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400 font-medium">Newsroom Investigation Export:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(getPressReleaseMarkdown(selectedReport));
                      setCopiedPressBrief(true);
                      setTimeout(() => setCopiedPressBrief(false), 2000);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                  >
                    {copiedPressBrief ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPressBrief ? 'Copied Markdown' : 'Copy Brief'}</span>
                  </button>

                  <button
                    onClick={() => generateJournalistPDF(selectedReport)}
                    className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
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
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>{isEscalating ? 'Escalating...' : 'Escalate to Official / Legal Queue'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
