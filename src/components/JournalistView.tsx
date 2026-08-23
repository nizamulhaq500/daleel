'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldAlert, CheckCircle, Clock, Search, Filter, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import NewsTicker from './NewsTicker';

export default function JournalistView() {
  const { user, dbUser } = useAuth();
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'reports'), where('status', '==', 'pending'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReports(docs);
    });

    return () => unsubscribe();
  }, []);

  const handleEscalate = async (id: string) => {
    try {
      const reportRef = doc(db, 'reports', id);
      await updateDoc(reportRef, {
        status: 'escalated',
        escalatedBy: user?.uid,
        escalatedByName: dbUser?.name || user?.displayName || 'Anonymous Journalist',
        escalatedByEmail: user?.email || '',
        escalatedByPhone: dbUser?.phone || '',
        escalatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error escalating report: ", error);
    }
  };

  const generatePDF = (report: any) => {
    const doc = new jsPDF();
    
    // --- BRAND HEADER ---
    doc.setFillColor(15, 23, 42); // bg-slate-900
    doc.rect(0, 0, 210, 35, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(59, 130, 246); // blue-500
    doc.text('Daleel', 20, 18);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text('Journalist Escalation Package', 20, 26);
    
    // --- TIMESTAMP ---
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(`Generated: ${new Date().toLocaleString()}`, 140, 20);
    doc.text(`Report ID: ${report.id.substring(0,8).toUpperCase()}`, 140, 26);
    
    let y = 50;

    // --- ESCALATION BADGE ---
    doc.setFillColor(59, 130, 246); // blue-500
    doc.rect(20, y - 6, 170, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`ESCALATED BY DALEEL NETWORK (Awaiting Official Action)`, 25, y);
    
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
    doc.text('2. Escalating Journalist', 110, y + 8);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${dbUser?.name || user?.displayName || 'N/A'}`, 110, y + 16);
    doc.text(`Contact: ${user?.email || 'N/A'}`, 110, y + 22);
    doc.text(`Phone: ${dbUser?.phone || 'N/A'}`, 110, y + 28);
    
    y += 45;

    // --- SEVERITY & PLATFORM ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(59, 130, 246);
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
      doc.setFillColor(15, 23, 42); 
      doc.rect(0, 0, 210, 20, 'F');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246);
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
    
    doc.save(`Daleel-Escalation-${report.id.substring(0,6)}.pdf`);
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-4 flex flex-col">
      <div className="mb-8 mt-4">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          {user?.displayName ? `Assalamualaikum, ${user.displayName.split(' ')[0]}` : 'Assalamualaikum'}
        </h2>
        <p className="text-slate-400 mt-2 max-w-2xl">
          Welcome to the Journalist Desk. Review community reports, verify evidence, and escalate severe threats to partner agencies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        <div className="lg:col-span-8 h-[520px]">
          <NewsTicker />
        </div>
        <div className="lg:col-span-4 flex flex-col justify-center">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
             <h3 className="text-xl font-bold text-white mb-4">Verification Desk</h3>
             <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-inner">
                  <p className="text-3xl font-black text-emerald-500">{reports.length}</p>
                  <p className="text-sm text-slate-400 font-medium">Pending Verifications</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-inner">
                  <p className="text-3xl font-black text-blue-500">28</p>
                  <p className="text-sm text-slate-400 font-medium">Reports Forwarded Today</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-500" />
            <input type="text" placeholder="Search cases..." className="bg-transparent border-none text-sm text-white focus:outline-none w-48" />
          </div>
          <button className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-12 gap-4 p-4 bg-slate-950/50 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <div className="col-span-2">Time / Source</div>
          <div className="col-span-1">Severity</div>
          <div className="col-span-7">Content / AI Context</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {reports.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <CheckCircle className="w-12 h-12 text-slate-700 mb-4" />
            <p className="text-slate-500 font-medium text-lg">Triage queue is empty.</p>
            <p className="text-slate-600 text-sm mt-1">All community reports have been processed.</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 hover:bg-slate-800/30 transition-colors items-center">
              <div className="col-span-2">
                <span className="block text-xs font-mono text-slate-500 mb-1">{report.sourcePlatform || 'Unknown'}</span>
                <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold">Reported by:</span>
                <span className="block text-xs font-medium text-slate-400">{report.reporterName || 'Anonymous'}</span>
              </div>
              
              <div className="col-span-1">
                <div className={`inline-flex flex-col items-center justify-center w-12 h-12 rounded-lg border ${report.severity === 'Critical' || report.severity === 'High' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                  <span className="font-bold text-lg leading-none">{report.aiScore}</span>
                </div>
              </div>
              
              <div className="col-span-7 pr-8">
                <p className="text-sm text-slate-300 line-clamp-1 font-medium mb-1">{report.content || 'Attached Image Evidence'}</p>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {report.categories?.map((cat: string, idx: number) => (
                    <span key={`cat-${idx}`} className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {cat}
                    </span>
                  ))}
                  {report.codedTerms?.map((term: string, idx: number) => (
                    <span key={`term-${idx}`} className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      {term}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">{report.contextExplanation}</p>
              </div>
              
              <div className="col-span-2 flex flex-col gap-2 text-right">
                <button 
                  onClick={() => generatePDF(report)}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-1 border border-slate-700"
                >
                  <FileText className="w-3 h-3" /> Get PDF
                </button>
                <button 
                  onClick={() => handleEscalate(report.id)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-blue-500/20 w-full"
                >
                  Verify & Forward
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
