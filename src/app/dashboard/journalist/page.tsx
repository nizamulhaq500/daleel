'use client';

import { useState } from 'react';
import JournalistView from '@/components/JournalistView';
import ReporterView from '@/components/ReporterView';
import ProcessedHistory from '@/components/ProcessedHistory';
import { ListFilter, PlusCircle } from 'lucide-react';

export default function JournalistPage() {
  const [activeTab, setActiveTab] = useState<'triage' | 'report'>('triage');

  return (
    <div className="flex-1 flex flex-col w-full bg-slate-950 p-8">
      <div className="border-b border-slate-800 bg-slate-900/50 px-8 py-3 flex gap-4 mb-8 rounded-t-3xl">
        <button
          onClick={() => setActiveTab('triage')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'triage' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <ListFilter className="w-4 h-4" />
          Triage Dashboard
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'report' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          Report New Evidence
        </button>
      </div>

      {activeTab === 'triage' ? <JournalistView /> : <ReporterView isJournalist={true} />}
      
      <div className="mt-12">
        <ProcessedHistory role="journalist" />
      </div>
    </div>
  );
}
