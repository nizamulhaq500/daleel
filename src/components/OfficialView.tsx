'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { FileText, Shield, CheckCircle, Download } from 'lucide-react';
import ProcessedHistory from '@/components/ProcessedHistory';
import { useAuth } from '@/contexts/AuthContext';
import jsPDF from 'jspdf';
import NewsTicker from './NewsTicker';

export default function OfficialView() {
  const { user, dbUser } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [showProfileWarning, setShowProfileWarning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const isProfileIncomplete = (!dbUser?.organization || !dbUser?.occupation || !dbUser?.credentialId);

  useEffect(() => {
    const q = query(collection(db, 'reports'), where('status', '==', 'escalated'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReports(docs);
    });

    return () => unsubscribe();
  }, []);

  const generatePDF = (report: any) => {
    const doc = new jsPDF();
    
    // --- BRAND HEADER ---
    doc.setFillColor(15, 23, 42); // bg-slate-900
    doc.rect(0, 0, 210, 35, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(245, 158, 11); // amber-500
    doc.text('Daleel', 20, 18);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text('Official Verified Evidence Report', 20, 26);
    
    // --- TIMESTAMP ---
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(`Generated: ${new Date().toLocaleString()}`, 140, 20);
    doc.text(`Report ID: ${report.id.substring(0,8).toUpperCase()}`, 140, 26);
    
    let y = 50;

    // --- VERIFICATION BADGE ---
    doc.setFillColor(16, 185, 129); // emerald-500
    doc.rect(20, y - 6, 170, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    const verificationTime = report.escalatedAt ? new Date(report.escalatedAt?.toDate ? report.escalatedAt.toDate() : report.escalatedAt).toLocaleString() : 'N/A';
    doc.text(`VERIFIED & ESCALATED BY DALEEL NETWORK (${verificationTime})`, 25, y);
    
    y += 15;

    // --- PERSONNEL ---
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(20, y, 170, 35, 'F');
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    
    doc.setFont("helvetica", "bold");
    doc.text('1. Original Reporter', 25, y + 8);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${report.reporterName || 'Anonymous'}`, 25, y + 16);
    doc.text(`Contact: ${report.reporterEmail || 'N/A'} | ${report.reporterPhone || 'N/A'}`, 25, y + 22);
    doc.text(`DOB: ${report.reporterDob || 'N/A'}`, 25, y + 28);

    doc.line(105, y + 5, 105, y + 30); // separator

    doc.setFont("helvetica", "bold");
    doc.text('2. Verifying Journalist', 110, y + 8);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${report.escalatedByName || 'N/A'}`, 110, y + 16);
    doc.text(`Contact: ${report.escalatedByEmail || 'N/A'}`, 110, y + 22);
    doc.text(`Phone: ${report.escalatedByPhone || 'N/A'}`, 110, y + 28);
    
    y += 45;

    // --- SEVERITY & PLATFORM ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(245, 158, 11);
    doc.text(`AI Severity Assessment: ${report.severity} (${report.aiScore}/10)`, 20, y);
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Source Platform: ${report.sourcePlatform || 'Unknown'}`, 20, y + 8);
    doc.line(20, y + 12, 190, y + 12);

    y += 25;

    // --- CONTENT & EVIDENCE ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Documented Evidence:', 20, y);
    
    y += 10;

    if (report.imageBase64) {
      try {
        doc.addImage(report.imageBase64, 20, y, 150, 90);
        y += 100;
      } catch (e) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.text('[Attached Image - Failed to render in PDF]', 20, y);
        y += 10;
      }
    }
    
    if (report.content) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const splitContent = doc.splitTextToSize(report.content, 170);
      doc.text(splitContent, 20, y);
      y += (splitContent.length * 5) + 10;
    }

    if (y > 230) {
      doc.addPage();
      // add mini header
      doc.setFillColor(15, 23, 42); 
      doc.rect(0, 0, 210, 20, 'F');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(245, 158, 11);
      doc.text('Daleel (Cont.)', 20, 13);
      y = 35;
    }

    // --- ANALYSIS ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Contextual Analysis & Harm Breakdown:', 20, y);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const splitNotes = doc.splitTextToSize(report.contextExplanation || 'No context generated.', 170);
    doc.text(splitNotes, 20, y + 10);
    
    doc.save(`Daleel-Official-Report-${report.id.substring(0,6)}.pdf`);
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-8 flex flex-col">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          {user?.displayName ? `Assalamualaikum, ${user.displayName.split(' ')[0]}` : 'Assalamualaikum'}
        </h2>
        <p className="text-slate-400 mt-2">Verified reports escalated to your Agency Inbox.</p>

      {isProfileIncomplete && (
        <div className="mt-6 bg-slate-900 border border-slate-700/50 rounded-2xl p-5 max-w-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-white font-semibold">Action Required: Complete Your Credentials</h4>
              <p className="text-sm text-slate-400">Please provide your Official ID to take legal takedown actions.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowSettings(true)}
            className="bg-amber-600 hover:bg-amber-500 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-colors"
          >
            Complete Profile <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
      
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        <div className="lg:col-span-8 h-[520px]">
          <NewsTicker />
        </div>
        <div className="lg:col-span-4 flex flex-col justify-center">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
             <h3 className="text-xl font-bold text-white mb-4">Agency Intelligence</h3>
             <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-inner">
                  <p className="text-3xl font-black text-emerald-500">{reports.length}</p>
                  <p className="text-sm text-slate-400 font-medium">Pending Takedowns</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-inner">
                  <p className="text-3xl font-black text-blue-500">14</p>
                  <p className="text-sm text-slate-400 font-medium">Platform Violations Issued</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-12 gap-4 p-4 bg-slate-950/50 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <div className="col-span-2">Case ID</div>
          <div className="col-span-3">Custody Status</div>
          <div className="col-span-4">Analyst Notes</div>
          <div className="col-span-2">Action</div>
          <div className="col-span-1 text-right">Details</div>
        </div>

        {/* Table Rows */}
        {reports.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No escalated cases at this time.</div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
              <div className="grid grid-cols-12 gap-4 p-4 items-center">
                <div className="col-span-2">
                  <span className="font-mono text-sm text-slate-300">#{report.id.substring(0, 8).toUpperCase()}</span>
                  <span className="block text-xs text-slate-500 mt-1">{report.date}</span>
                </div>
                
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-slate-200">Journalist Desk</span>
                  </div>
                  <span className="block text-xs text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Chain of Custody Intact
                  </span>
                </div>
                
                <div className="col-span-4">
                  <p className="text-sm text-slate-300 line-clamp-2">{report.contextExplanation || 'No context notes provided.'}</p>
                </div>
                
                <div className="col-span-2 flex flex-col gap-2">
                  <button 
                    onClick={() => generatePDF(report)}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg font-bold transition-colors border border-slate-700 w-full text-center flex justify-center items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> PDF Report
                  </button>
                  <button 
                    onClick={() => {
                      const subject = encodeURIComponent(`URGENT TAKEDOWN REQUEST - Case #${report.id.substring(0, 8).toUpperCase()} - Threat Level: ${report.severity}`);
                      const body = encodeURIComponent(`To the Trust and Safety Team at ${report.sourcePlatform || 'the respective platform'},\n\nI am writing to you on behalf of the Daleel Threat Intelligence network to formally request the immediate removal of content that violates both your platform's Hate Speech policies and US Government guidelines regarding targeted harassment and incitement of violence.\n\nCase ID: #${report.id.substring(0, 8).toUpperCase()}\nSeverity Level: ${report.severity} (${report.aiScore}/10)\nDetected Categories: ${report.categories?.join(', ') || 'N/A'}\n\nEvidence Summary:\n${report.contextExplanation}\n\nWe have attached the full generated PDF report to this email for your legal team's review. Please confirm receipt and action taken within 24 hours.\n\nSincerely,\nOfficial Law Enforcement / Civil Rights Desk`);
                      window.location.href = `mailto:trust-and-safety@${(report.sourcePlatform || 'platform').toLowerCase().replace(/\s+/g, '')}.com?subject=${subject}&body=${body}`;
                    }}
                    className="text-xs bg-red-600/20 hover:bg-red-600/30 text-red-500 px-3 py-1.5 rounded-lg font-bold transition-colors border border-red-500/30 w-full text-center"
                  >
                    Request Takedown
                  </button>
                </div>

                <div className="col-span-1 text-right relative">
                  <button 
                    onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                    className="text-amber-500 hover:text-amber-400 p-2"
                  >
                    <FileText className="w-5 h-5 inline-block" />
                  </button>
                </div>
              </div>
              
              {/* Expanded Evidence View */}
              {expandedId === report.id && (
                <div className="bg-slate-950/80 p-6 border-t border-slate-800/50">
                  <h4 className="text-white font-bold mb-4 flex justify-between items-center">
                    <span>Evidence Package Details</span>
                    <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded">Source: {report.sourcePlatform || 'Unknown'}</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Original Content</h5>
                      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-sm text-slate-300 break-words mb-4">
                        {report.content}
                      </div>
                      
                      <h5 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Reporter Information</h5>
                      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-sm text-slate-300 break-words">
                        <div><span className="font-bold">Name:</span> {report.reporterName || 'Anonymous'}</div>
                        <div><span className="font-bold">Email:</span> {report.reporterEmail || 'N/A'}</div>
                        <div><span className="font-bold">Reporter ID:</span> <span className="font-mono text-xs text-slate-500">{report.reporterId}</span></div>
                      </div>

                      {report.imageBase64 && (
                        <div className="mt-4">
                          <h5 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Attached Image</h5>
                          <img src={report.imageBase64} alt="Evidence" className="max-w-full rounded-lg border border-slate-800" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h5 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Analysis & Notes</h5>
                      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-sm text-slate-300 space-y-4">
                        <div>
                          <span className="font-bold text-slate-200">Severity: </span>
                          <span className={report.severity === 'Critical' || report.severity === 'High' ? 'text-red-400 font-bold' : 'text-amber-400 font-bold'}>
                            {report.severity} ({report.aiScore}/10)
                          </span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-200">Categories: </span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {report.categories?.length ? report.categories.map((cat: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-bold border border-indigo-500/30">{cat}</span>
                            )) : 'None'}
                          </div>
                        </div>
                        <div>
                          <span className="font-bold text-slate-200">Coded Language: </span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {report.codedTerms?.length ? report.codedTerms.map((term: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full text-xs font-bold border border-slate-700">{term}</span>
                            )) : 'None detected'}
                          </div>
                        </div>
                        <div>
                          <span className="font-bold text-slate-200 block mb-1">Context Explanation: </span>
                          <p className="mt-1 leading-relaxed text-slate-400">{report.contextExplanation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div className="mt-12">
        <ProcessedHistory role="official" />
            {showSettings && <ProfileSettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />}
    </div>
    </div>
  );
}
