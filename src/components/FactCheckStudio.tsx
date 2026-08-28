'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Brain, 
  Search, 
  ImagePlus, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Share2, 
  Twitter, 
  ExternalLink,
  BookOpen,
  Sparkles,
  Loader2
} from 'lucide-react';

const SUGGESTED_QUERIES = [
  { label: 'Halal Certification Tax', query: 'Does halal certification act as a jizya tax funding extremism?' },
  { label: 'Creeping Sharia', query: 'Is there a secret plot to replace Western legal systems with Sharia law?' },
  { label: 'Demographic Replacement', query: 'Are Muslim birth rates designed to replace Western native populations?' },
  { label: 'Taqiyya Misrepresentation', query: 'Does Islam instruct Muslims to lie to non-Muslims through Taqiyya?' }
];

export default function FactCheckStudio() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ claim: string; refutation: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageBase64(null);
    setImageFileName(null);
  };

  const executeFactCheck = async (textToQuery: string) => {
    const activeQuery = textToQuery.trim();
    if (!activeQuery && !imageBase64) return;

    setLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (user) {
        try {
          const token = await user.getIdToken();
          if (token) headers['Authorization'] = `Bearer ${token}`;
        } catch (e) {
          // Continue without auth header if token retrieval fails
        }
      }

      const response = await fetch('/api/factcheck', {
        method: 'POST',
        headers,
        body: JSON.stringify({ query: activeQuery, imageBase64 }),
      });

      const data = await response.json();

      if (data.refutation) {
        setResult({
          claim: data.claim || activeQuery || 'Attached Screenshot/Document',
          refutation: data.refutation
        });
      } else if (data.error) {
        setErrorMsg(data.error);
      } else {
        setErrorMsg('Unable to retrieve fact-check at this moment. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg('Network error. Unable to reach the fact-checking engine.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeFactCheck(query);
  };

  const handleSelectSuggested = (suggestedQuery: string) => {
    setQuery(suggestedQuery);
    executeFactCheck(suggestedQuery);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(`Fact Check: ${result.claim}\n\n${result.refutation}\n\n— Verified via Daleel Trust & Safety`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareToTwitter = () => {
    if (!result) return;
    const text = `Fact Check via @Daleel:\n\nClaim: "${result.claim}"\n\nVerified Refutation: ${result.refutation.slice(0, 180)}...`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="w-full bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Brain className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 tracking-tight">
              Interactive Fact-Checking Terminal
            </h3>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Submit a viral claim, social media post, or upload a screenshot to receive instant factual refutations with verified citations.
          </p>
        </div>

        {/* Database citation badge */}
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg shrink-0">
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span>Indexed: <strong>Bridge Initiative</strong> & <strong>Tell MAMA</strong></span>
        </div>
      </div>

      {/* Suggested Queries */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Quick-Test Common Disinformation Tropes:
        </p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUERIES.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSuggested(item.query)}
              disabled={loading}
              className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg transition-all text-left flex items-center gap-1.5 disabled:opacity-50"
            >
              <Search className="w-3 h-3 text-slate-500" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type or paste a viral headline, claim, or coded phrase here (e.g., 'Halal fees fund terrorism', 'Creeping Sharia in local councils')..."
            rows={3}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 resize-none transition-all"
          />

          {/* Attached Image Badge */}
          {imageBase64 && (
            <div className="absolute left-3 bottom-3 flex items-center gap-2 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg text-xs text-slate-200">
              <span className="truncate max-w-[200px]">{imageFileName || 'Attached Image'}</span>
              <button 
                type="button" 
                onClick={removeImage}
                className="text-slate-400 hover:text-red-400"
                title="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-2 rounded-lg cursor-pointer transition-colors">
              <ImagePlus className="w-4 h-4 text-slate-400" />
              <span>Upload Screenshot/Doc</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={loading}
              />
            </label>

            {(query || imageBase64) && (
              <button
                type="button"
                onClick={() => { setQuery(''); removeImage(); setResult(null); }}
                className="text-xs text-slate-400 hover:text-slate-200 px-2.5 py-2 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || (!query.trim() && !imageBase64)}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-all shadow-md shadow-emerald-950/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Database...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Verify & Fact-Check</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {errorMsg && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Verification Result Card */}
      {result && (
        <div className="mt-6 pt-6 border-t border-slate-800 space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Verified Refutation & Context
              </span>
            </div>

            {/* Share / Copy Toolbar */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2.5 py-1.5 rounded-lg transition-colors"
                title="Copy refutation"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={shareToTwitter}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2.5 py-1.5 rounded-lg transition-colors"
                title="Share on X"
              >
                <Twitter className="w-3.5 h-3.5 text-sky-400" />
                <span>Post</span>
              </button>
            </div>
          </div>

          {/* Investigated Claim Header */}
          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Investigated Claim:
            </span>
            <p className="text-sm font-medium text-slate-200 italic">
              "{result.claim}"
            </p>
          </div>

          {/* Refutation Body */}
          <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans space-y-2">
            {result.refutation}
          </div>

          {/* Academic Footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-2 px-1">
            <span>Sources: The Bridge Initiative (Georgetown Univ) &bull; Tell MAMA UK &bull; ISPU</span>
            <span className="text-emerald-400/80 font-medium">Public Interest Verification Pipeline</span>
          </div>
        </div>
      )}
    </div>
  );
}
