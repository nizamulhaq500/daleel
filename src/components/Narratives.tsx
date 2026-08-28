"use client";

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Twitter, Facebook, MessageCircle, Link2, Share2, Check, Linkedin, Send, Mail, X, BookOpen } from 'lucide-react';
import { narratives, Narrative } from '@/lib/narratives';

export default function Narratives() {
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedNarrative, setSelectedNarrative] = useState<Narrative | null>(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayedNarratives = narratives.slice(0, visibleCount);

  return (
    <div className="w-full py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Documented Hate Tropes & Counter-Narratives</span>
          </div>
          <h2 id="narratives-heading" className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            Verified Knowledge Base
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Exposing recurrent anti-Muslim conspiracy theories, historical misrepresentations, and dog-whistles alongside verified factual refutations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedNarratives.map((item) => (
          <div 
            key={item.id} 
            onClick={() => { setSelectedNarrative(item); setCopied(false); }}
            className="group bg-[#0f172a] border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition-all cursor-pointer hover:shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-block px-2.5 py-0.5 bg-red-500/10 text-red-400 text-xs font-semibold rounded">
                  {item.category}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Deconstructed</span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-100 mb-3 leading-snug line-clamp-2">
                "{item.claim}"
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                {item.reality}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-medium">
              <span>View Evidence & Share</span>
              <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {visibleCount < narratives.length && (
          <button 
            onClick={() => setVisibleCount(prev => prev + 6)}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold transition-colors border border-slate-800 hover:border-slate-700 shadow-sm"
          >
            Load More Documented Tropes ({narratives.length - visibleCount} remaining)
          </button>
        )}

        {visibleCount > 6 && (
          <button 
            onClick={() => {
              setVisibleCount(6);
              // Scroll up gently to the narratives header
              const el = document.getElementById('narratives-heading');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-semibold transition-colors border border-slate-800 hover:border-slate-700 shadow-sm flex items-center gap-1.5"
          >
            <span>Show Fewer Tropes (Collapse)</span>
          </button>
        )}
      </div>

      {/* Narrative Modal */}
      {selectedNarrative && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          onClick={() => setSelectedNarrative(null)}
        >
          <div 
            className="bg-[#0f172a] border border-slate-700/80 rounded-2xl p-6 sm:p-8 max-w-2xl w-full relative shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedNarrative(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-2 bg-slate-900 rounded-full hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="mb-6 pt-1">
              <span className="inline-block px-2.5 py-1 bg-red-500/10 text-red-400 text-xs font-semibold rounded mb-3">
                False Narrative: {selectedNarrative.category}
              </span>
              <h3 className="text-xl font-bold text-slate-100 leading-snug">
                "{selectedNarrative.claim}"
              </h3>
            </div>
            
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 mb-6">
              <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded mb-3">
                Factual Reality & Context
              </span>
              <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                {selectedNarrative.reality}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                Disseminate Counter-Narrative
              </h4>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("False Claim: " + selectedNarrative.claim + "\n\nVerified Fact: " + selectedNarrative.reality + "\n\nvia @Daleel")}`, '_blank')}
                  className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                >
                  <Twitter className="w-3.5 h-3.5 text-sky-400" /> X (Twitter)
                </button>
                <button 
                  onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent("Fact Check:\n\nClaim: " + selectedNarrative.claim + "\n\nReality: " + selectedNarrative.reality)}`, '_blank')}
                  className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp
                </button>
                <button 
                  onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=https://daleel.org&title=${encodeURIComponent('Fact Check: ' + selectedNarrative.claim)}`, '_blank')}
                  className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5 text-blue-400" /> LinkedIn
                </button>
                <button 
                  onClick={() => copyToClipboard(`Fact Check:\n\nClaim: ${selectedNarrative.claim}\n\nReality: ${selectedNarrative.reality}`)}
                  className="flex items-center gap-1.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ml-auto"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />} 
                  {copied ? 'Copied to Clipboard!' : 'Copy Summary'}
                </button>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
