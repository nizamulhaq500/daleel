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
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
    doc.setFontSize(20);
    doc.text('Daleel Official Intelligence Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
    doc.text(`Severity: ${report.severity} (${report.aiScore}/10)`, 20, 40);
    doc.text(`Platform: ${report.sourcePlatform || 'Unknown'}`, 20, 50);
    doc.text(`Reported By: ${report.reporterName || 'Anonymous'} (${report.reporterEmail || 'N/A'})`, 20, 60);
    doc.text(`Categories: ${report.categories?.join(', ') || 'N/A'}`, 20, 70);
    
    doc.setFontSize(14);
    doc.text('Content Analysed:', 20, 90);
    doc.setFontSize(10);
    const splitContent = doc.splitTextToSize(report.content || 'Image Content Attached', 170);
    doc.text(splitContent, 20, 100);

    doc.setFontSize(14);
    doc.text('Context & Notes:', 20, 150);
    doc.setFontSize(10);
    const splitNotes = doc.splitTextToSize(report.contextExplanation || 'N/A', 170);
    doc.text(splitNotes, 20, 160);
    
    doc.save(`Daleel-Official-Report-${report.id.substring(0,6)}.pdf`);
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-8 flex flex-col">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          {user?.displayName ? `Assalamualaikum, ${user.displayName.split(' ')[0]}` : 'Assalamualaikum'}
        </h2>
        <p className="text-slate-400 mt-2">Verified reports escalated to your Agency Inbox.</p>
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
      </div>
    </div>
  );
}
