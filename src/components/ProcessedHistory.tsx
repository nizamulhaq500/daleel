'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Shield, CheckCircle } from 'lucide-react';

export default function ProcessedHistory({ role }: { role: 'journalist' | 'official' }) {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    // For Hackathon demo purposes, we will fetch 'escalated' for Journalist history 
    // and 'takedown' (if it existed) for Official. We'll just fetch all escalated as a mock history.
    const q = query(collection(db, 'reports'), where('status', '==', 'escalated'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReports(docs);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl mt-8">
      <h3 className="text-2xl font-bold text-white mb-6">Action History Log</h3>
      
      <div className="space-y-4">
        {reports.length === 0 ? (
          <p className="text-slate-400">No previous actions found.</p>
        ) : (
          reports.map(report => (
            <div key={report.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between opacity-70">
              <div>
                <span className="text-xs text-slate-500 font-mono">#{report.id.substring(0,8).toUpperCase()}</span>
                <p className="text-slate-300 mt-1 line-clamp-1 max-w-md">{report.content || 'Image Evidence'}</p>
              </div>
              <div className="text-right flex items-center gap-4">
                <span className="flex items-center gap-1 text-slate-400 text-sm font-medium bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                  <CheckCircle className="w-4 h-4" /> 
                  {role === 'journalist' ? 'Escalated to Officials' : 'Takedown Requested'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
