'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, limit, where, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldAlert, CheckCircle, FileText, Clock, X, AlertTriangle } from 'lucide-react';

export default function ReporterHistory() {
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'reports'), where('reporterId', '==', user?.uid || ''), orderBy('timestamp', 'desc'), limit(15));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReports(docs);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <>
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl mt-8">
        <h3 className="text-2xl font-bold text-white mb-6">Recent Submissions</h3>
        
        <div className="space-y-4">
          {reports.length === 0 ? (
            <p className="text-slate-400">You haven't submitted any reports yet.</p>
          ) : (
            reports.map(report => (
              <div 
                key={report.id} 
                onClick={() => setSelectedReport(report)}
                className="bg-slate-950 border border-slate-800 hover:border-blue-500/50 cursor-pointer p-4 rounded-xl flex items-center justify-between transition-all"
              >
                <div>
                  <span className="text-xs text-slate-500 font-mono">#{report.id.substring(0,8).toUpperCase()}</span>
                  <p className="text-slate-200 mt-1 line-clamp-1 max-w-md">{report.content || 'Image Submission'}</p>
                </div>
                <div className="text-right flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4">
                  {report.status === 'escalated' ? (
                    <span className="flex items-center gap-1 text-emerald-400 text-sm font-medium bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      <CheckCircle className="w-4 h-4" /> Actioned
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-400 text-sm font-medium bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                      <Clock className="w-4 h-4" /> Under Review
                    </span>
                  )}
                  <span className="text-blue-400 text-xs font-semibold hover:underline hidden sm:block">View details &rarr;</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL FOR REPORT DETAILS */}
      {selectedReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Report Details
                <span className="text-sm font-mono text-slate-500 ml-2">#{selectedReport.id.substring(0,8).toUpperCase()}</span>
              </h2>
              <button 
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Platform: <span className="font-semibold text-white">{selectedReport.sourcePlatform || 'Not Specified'}</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Status: <span className="font-semibold text-white capitalize">{selectedReport.status}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Reported Content</h4>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-200 whitespace-pre-wrap">
                  {selectedReport.content || <span className="italic text-slate-500">No text content provided.</span>}
                </div>
                {selectedReport.imageBase64 && (
                  <div className="mt-4">
                    <img src={selectedReport.imageBase64} alt="Evidence" className="max-w-full h-auto rounded-lg border border-slate-700 max-h-64 object-cover" />
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">AI Analysis</h4>
                <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-5 h-5 ${selectedReport.severity === 'Critical' ? 'text-red-500' : selectedReport.severity === 'High' ? 'text-orange-500' : 'text-amber-500'}`} />
                    <span className="text-white font-medium">Severity: {selectedReport.severity}</span>
                  </div>
                  {selectedReport.contextExplanation && (
                    <p className="text-slate-300 text-sm leading-relaxed">{selectedReport.contextExplanation}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-800 flex justify-end">
              <button 
                onClick={() => setSelectedReport(null)}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
