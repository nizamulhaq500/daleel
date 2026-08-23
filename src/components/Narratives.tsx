"use client";

import { useState } from 'react';
import { Twitter, Facebook, MessageCircle, Link2, Share2, Check } from 'lucide-react';
import { narratives, Narrative } from '@/lib/narratives';

export default function Narratives() {
  const [visibleCount, setVisibleCount] = useState(10);
  const [selectedNarrative, setSelectedNarrative] = useState<Narrative | null>(null);
  const [copied, setCopied] = useState(false);

  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayedNarratives = narratives.slice(0, visibleCount);

  return (
    <div className="w-full max-w-6xl mx-auto py-16 px-4 relative">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 text-slate-100">Know What Islamophobes Think of You</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Get ready with your answers. Below are the actual narratives, conspiracy theories, and dog whistles spread by hate groups—and the factual refutations you need to dismantle them.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {displayedNarratives.map((item) => (
          <div 
            key={item.id} 
            onClick={() => { setSelectedNarrative(item); setCopied(false); }}
            className="group relative bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-hidden hover:border-emerald-500/50 transition-all duration-500 cursor-pointer"
          >
            {/* The initial claim state */}
            <div className="relative z-10 h-full flex flex-col justify-between transition-transform duration-500 ease-in-out group-hover:-translate-x-full group-hover:opacity-0">
              <div>
                <span className="inline-block px-3 py-1 bg-red-500/10 text-red-400 text-xs font-semibold rounded-full mb-4">
                  {item.category}
                </span>
                <h3 className="text-xl font-semibold text-slate-200 mb-2 leading-snug">
                  "{item.claim}"
                </h3>
              </div>
              <div className="mt-6 flex items-center justify-between text-emerald-500 text-sm font-medium">
                <span>Swipe right / Hover for the Truth &rarr;</span>
                <span className="text-slate-500">Click to expand</span>
              </div>
            </div>

            {/* The refutation reveal state */}
            <div className="absolute inset-0 z-20 p-6 bg-slate-800 flex flex-col justify-center transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out">
              <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full mb-4 w-max">
                The Reality
              </span>
              <p className="text-slate-200 text-sm leading-relaxed line-clamp-4">
                {item.reality}
              </p>
              <div className="mt-4 text-emerald-400 text-xs font-semibold">Click to read full details</div>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < narratives.length && (
        <div className="mt-12 text-center">
          <button 
            onClick={() => setVisibleCount(prev => prev + 10)}
            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-colors border border-slate-700"
          >
            Load 10 More Narratives
          </button>
        </div>
      )}

      {/* Narrative Modal */}
      {selectedNarrative && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          onClick={() => setSelectedNarrative(null)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-2xl w-full relative shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedNarrative(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-2 bg-slate-800 rounded-full hover:bg-slate-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="mb-8 pt-2">
              <span className="inline-block px-3 py-1 bg-red-500/10 text-red-400 text-xs font-semibold rounded-full mb-4">
                False Narrative ({selectedNarrative.category})
              </span>
              <h3 className="text-2xl font-bold text-slate-100 leading-snug">
                "{selectedNarrative.claim}"
              </h3>
            </div>
            
            <div className="bg-slate-800 rounded-xl p-6 border border-emerald-900/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
              <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full mb-4">
                The Reality & Fact Check
              </span>
              <p className="text-slate-200 text-base leading-relaxed whitespace-pre-wrap">
                {selectedNarrative.reality}
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800">
              <h4 className="text-slate-300 font-bold mb-4 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-emerald-500" />
                Spread Facts, Debunk Claims
              </h4>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("False Claim: " + selectedNarrative.claim + "\n\nThe Truth: " + selectedNarrative.reality + "\n\n#Daleel #FactCheck")}`, '_blank')}
                  className="flex items-center gap-2 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  <Twitter className="w-4 h-4" /> Share on X
                </button>
                <button 
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=https://daleel.com`, '_blank')}
                  className="flex items-center gap-2 bg-[#4267B2]/10 hover:bg-[#4267B2]/20 text-[#4267B2] px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  <Facebook className="w-4 h-4" /> Facebook
                </button>
                <button 
                  onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent("Fact Check:\n\nClaim: " + selectedNarrative.claim + "\n\nReality: " + selectedNarrative.reality)}`, '_blank')}
                  className="flex items-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </button>
                <button 
                  onClick={() => copyToClipboard(`Fact Check:\n\nClaim: ${selectedNarrative.claim}\n\nReality: ${selectedNarrative.reality}`)}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ml-auto"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Link2 className="w-4 h-4" />} 
                  {copied ? 'Copied!' : 'Copy Text'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
