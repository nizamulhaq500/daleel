'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { FileText, Shield, CheckCircle } from 'lucide-react';
import ProcessedHistory from '@/components/ProcessedHistory';
import { useAuth } from '@/contexts/AuthContext';

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

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-8 flex flex-col">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          {user?.displayName ? `Assalamualaikum, ${user.displayName.split(' ')[0]}` : 'Assalamualaikum'}
        </h2>
        <p className="text-slate-400 mt-2">Verified reports escalated to your Agency Inbox.</p>
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
                
                <div className="col-span-2">
                  <button className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg font-medium transition-colors border border-slate-700 w-full text-center">
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
                  <h4 className="text-white font-bold mb-4">Evidence Package</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Original Content</h5>
                      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-sm text-slate-300 break-words">
                        {report.content}
                      </div>
                      {report.imageBase64 && (
                        <div className="mt-4">
                          <h5 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Attached Image</h5>
                          <img src={report.imageBase64} alt="Evidence" className="max-w-full rounded-lg border border-slate-800" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h5 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">AI Analysis & Notes</h5>
                      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-sm text-slate-300 space-y-4">
                        <div>
                          <span className="font-bold text-slate-200">Severity: </span>
                          <span className={report.severity === 'Critical' || report.severity === 'High' ? 'text-red-400' : 'text-amber-400'}>
                            {report.severity} ({report.aiScore}/10)
                          </span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-200">Coded Language: </span>
                          {report.codedTerms?.join(', ') || 'None detected'}
                        </div>
                        <div>
                          <span className="font-bold text-slate-200">Context Explanation: </span>
                          <p className="mt-1">{report.contextExplanation}</p>
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
