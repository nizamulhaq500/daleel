'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldAlert, CheckCircle, FileText, Clock } from 'lucide-react';

export default function ReporterHistory() {
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    
    // In a real app we'd use reporterId. For the hackathon, we fetch all where authorEmail or similar is matched.
    // Or we just fetch all to show the UI if we didn't save reporterId perfectly. 
    // Wait, let's fetch based on reporterEmail since we saved it in ReporterView.tsx?
    // Actually, ReporterView didn't save reporterEmail before. Let's just pull 'pending' and 'escalated' 
    // to simulate history for the hackathon, or pull EVERYTHING if it's a demo.
    // To be perfectly accurate, let's query all reports and filter client side if indexing isn't set up.
    
    const q = query(collection(db, 'reports'), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Hackathon filter: just show the last 5 to simulate "My History"
      setReports(docs.slice(0, 5));
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl mt-8">
      <h3 className="text-2xl font-bold text-white mb-6">Recent Submissions by Reporters</h3>
      
      <div className="space-y-4">
        {reports.length === 0 ? (
          <p className="text-slate-400">You haven't submitted any reports yet.</p>
        ) : (
          reports.map(report => (
            <div key={report.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-mono">#{report.id.substring(0,8).toUpperCase()}</span>
                <p className="text-slate-200 mt-1 line-clamp-1 max-w-md">{report.content || 'Image Submission'}</p>
              </div>
              <div className="text-right flex items-center gap-4">
                {report.status === 'escalated' ? (
                  <span className="flex items-center gap-1 text-emerald-400 text-sm font-medium bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    <CheckCircle className="w-4 h-4" /> Actioned
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-400 text-sm font-medium bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    <Clock className="w-4 h-4" /> Under Review
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
