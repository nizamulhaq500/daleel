'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Code2, 
  Copy, 
  Check, 
  X, 
  Sparkles, 
  ExternalLink, 
  Eye,
  Layers,
  Palette
} from 'lucide-react';
import { BsOctagonHalf } from 'react-icons/bs';

export default function EmbedWidgetModal({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [widgetTheme, setWidgetTheme] = useState<'dark' | 'midnight' | 'emerald'>('dark');
  const [codeType, setCodeType] = useState<'iframe' | 'react' | 'webcomponent'>('iframe');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const getEmbedCode = () => {
    if (codeType === 'iframe') {
      return `<iframe
  src="https://daleel.org/embed/factcheck?theme=${widgetTheme}"
  width="100%"
  height="480"
  frameborder="0"
  allow="clipboard-write"
  style="border-radius: 16px; border: 1px solid #1e293b;"
  title="Daleel AI Fact-Check Terminal"
></iframe>`;
    }

    if (codeType === 'react') {
      return `import React from 'react';

export default function DaleelFactCheckWidget() {
  return (
    <iframe
      src="https://daleel.org/embed/factcheck?theme=${widgetTheme}"
      width="100%"
      height="480"
      className="rounded-2xl border border-slate-800 shadow-xl"
      title="Daleel AI Fact-Check Terminal"
    />
  );
}`;
    }

    return `<script src="https://daleel.org/widget.js" async></script>
<daleel-factcheck theme="${widgetTheme}"></daleel-factcheck>`;
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-[#ffffff] dark:bg-[#0f172a] border border-[#dfd2bf] dark:border-slate-700 rounded-3xl max-w-4xl w-full p-4 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#dfd2bf] dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1e140d] dark:text-slate-100">
                Embeddable Fact-Check Widget Generator
              </h2>
              <p className="text-xs text-[#705845] dark:text-slate-400 mt-0.5">
                Embed Daleel's verified AI fact-checking terminal on your blog, newsroom, or student newspaper.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 dark:hover:text-white p-1 rounded-lg hover:bg-[#f5ebe0] dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Column: Live Preview on Left, Code Output on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Live Preview */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#523d2e] dark:text-slate-300 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Live Widget Preview
              </span>
              
              {/* Theme Picker */}
              <div className="flex items-center gap-1 bg-[#f7efe4] dark:bg-slate-950 p-1 rounded-lg border border-[#dfd2bf] dark:border-slate-800 text-[11px]">
                <button
                  onClick={() => setWidgetTheme('dark')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${widgetTheme === 'dark' ? 'bg-[#c26e27] dark:bg-slate-800 text-white' : 'text-[#705845] dark:text-slate-400'}`}
                >
                  Dark Slate
                </button>
                <button
                  onClick={() => setWidgetTheme('midnight')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${widgetTheme === 'midnight' ? 'bg-[#c26e27] dark:bg-slate-800 text-white' : 'text-[#705845] dark:text-slate-400'}`}
                >
                  Midnight
                </button>
                <button
                  onClick={() => setWidgetTheme('emerald')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${widgetTheme === 'emerald' ? 'bg-[#c26e27] dark:bg-slate-800 text-white' : 'text-[#705845] dark:text-slate-400'}`}
                >
                  Emerald
                </button>
              </div>
            </div>

            {/* Mock Rendered Widget */}
            <div className={`p-5 rounded-2xl border ${
              widgetTheme === 'midnight' ? 'bg-[#030712] border-slate-800' :
              widgetTheme === 'emerald' ? 'bg-[#061e16] border-emerald-900/60' :
              'bg-[#0b101b] border-slate-800'
            } shadow-xl space-y-4`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-500/20 p-1.5 rounded-lg border border-emerald-500/30">
                    <BsOctagonHalf className="w-4 h-4 text-emerald-400 rotate-45" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-white block leading-tight">Daleel Fact-Check</span>
                    <span className="text-[10px] text-slate-400">Public Interest Verification</span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                  Live
                </span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between text-xs text-slate-400">
                <span>Enter claim or paste headline...</span>
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg">Check</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                <span className="text-[10px] font-bold uppercase text-emerald-400 block">Verified Finding:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Halal certification is a voluntary, standard compliance audit identical to Kosher or Vegan labeling; zero evidence links certified food brands to terror financing.
                </p>
                <span className="text-[10px] text-slate-500 block pt-1">Source: The Bridge Initiative (Georgetown)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Code Snippet & Configuration */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#523d2e] dark:text-slate-300 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Integration Code
              </span>

              {/* Code Format Switcher */}
              <div className="flex items-center gap-1 bg-[#f7efe4] dark:bg-slate-950 p-1 rounded-lg border border-[#dfd2bf] dark:border-slate-800 text-[11px]">
                <button
                  onClick={() => setCodeType('iframe')}
                  className={`px-2.5 py-1 rounded font-medium cursor-pointer ${codeType === 'iframe' ? 'bg-[#c26e27] dark:bg-emerald-600 text-white' : 'text-[#705845] dark:text-slate-400'}`}
                >
                  iFrame
                </button>
                <button
                  onClick={() => setCodeType('react')}
                  className={`px-2.5 py-1 rounded font-medium cursor-pointer ${codeType === 'react' ? 'bg-[#c26e27] dark:bg-emerald-600 text-white' : 'text-[#705845] dark:text-slate-400'}`}
                >
                  React / Next.js
                </button>
                <button
                  onClick={() => setCodeType('webcomponent')}
                  className={`px-2.5 py-1 rounded font-medium cursor-pointer ${codeType === 'webcomponent' ? 'bg-[#c26e27] dark:bg-emerald-600 text-white' : 'text-[#705845] dark:text-slate-400'}`}
                >
                  Web Component
                </button>
              </div>
            </div>

            {/* Code Output Box */}
            <div className="relative">
              <pre className="bg-[#fdfaf5] dark:bg-slate-950 p-4 rounded-2xl border border-[#dfd2bf] dark:border-slate-800 text-[#1e140d] dark:text-slate-300 font-mono text-xs overflow-x-auto leading-relaxed">
                {getEmbedCode()}
              </pre>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(getEmbedCode());
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="w-full bg-[#c26e27] hover:bg-[#a05417] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Code Snippet Copied to Clipboard!' : 'Copy Embed Code Snippet'}</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-[#dfd2bf] dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#ede2d3] hover:bg-[#e4d5c3] dark:bg-slate-800 dark:hover:bg-slate-700 text-[#1e140d] dark:text-slate-200 border border-[#dfd2bf] dark:border-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
