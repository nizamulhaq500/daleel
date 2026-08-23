'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldAlert, CheckCircle, Clock, Search, Filter } from 'lucide-react';

export default function JournalistView() {
  const { user } = useAuth();
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
        escalatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error escalating report: ", error);
    }
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
                <span className="block text-xs font-mono text-slate-500">{report.id.substring(0, 8)}</span>
                <span className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                  <Clock className="w-3 h-3" /> Just now
                </span>
              </div>
              
              <div className="col-span-1">
                <div className={`inline-flex flex-col items-center justify-center w-12 h-12 rounded-lg border ${report.severity === 'Critical' || report.severity === 'High' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                  <span className="font-bold text-lg leading-none">{report.aiScore}</span>
                </div>
              </div>
              
              <div className="col-span-7 pr-8">
                <p className="text-sm text-slate-300 line-clamp-1 font-medium mb-1">{report.content || 'Attached Image Evidence'}</p>
                <div className="flex gap-2 mb-2">
                  {report.codedTerms?.map((term: string, idx: number) => (
                    <span key={idx} className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      {term}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">{report.contextExplanation}</p>
              </div>
              
              <div className="col-span-2 text-right">
                <button 
                  onClick={() => handleEscalate(report.id)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-blue-500/20 w-full"
                >
                  Verify & Escalate
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
