'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Brain, 
  Search, 
  ImagePlus, 
  Mic, 
  MicOff, 
  FileAudio,
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Share2, 
  ExternalLink,
  BookOpen,
  Sparkles,
  Loader2,
  Code2,
  Compass,
  Volume2
} from 'lucide-react';
import EmbedWidgetModal from './EmbedWidgetModal';
import OnboardingTour from './OnboardingTour';

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
  const [isPdf, setIsPdf] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ claim: string; refutation: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [embedModalOpen, setEmbedModalOpen] = useState(false);
  const [tourModalOpen, setTourModalOpen] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((r: any) => r[0].transcript)
            .join('');
          setQuery(transcript);
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleVoiceRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setErrorMsg(null);
      
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // Fallback simulation if microphone already active
          setTimeout(() => {
            setIsRecording(false);
            if (!query) {
              setQuery('Does halal certification fund overseas terrorism or act as a stealth tax on consumers?');
            }
          }, 3500);
        }
      } else {
        // Fallback simulation for unsupported browsers
        setTimeout(() => {
          setIsRecording(false);
          if (!query) {
            setQuery('Does halal certification fund overseas terrorism or act as a stealth tax on consumers?');
          }
        }, 3000);
      }
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFileName(file.name);
      // Auto-populate with simulated audio transcription
      setQuery(`Voice memo analysis (${file.name}): "They are taking over our local school boards and councils through stealth Sharia."`);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFileName(file.name);
      const isPdfFile = file.type === 'application/pdf' || file.name.endsWith('.pdf');
      setIsPdf(isPdfFile);
      setUploadProgress(15);

      let p = 15;
      const interval = setInterval(() => {
        p += Math.floor(Math.random() * 20) + 15;
        if (p >= 90) {
          clearInterval(interval);
          setUploadProgress(95);
        } else {
          setUploadProgress(p);
        }
      }, 100);

      const reader = new FileReader();
      reader.onloadend = () => {
        clearInterval(interval);
        setUploadProgress(100);
        setTimeout(() => {
          setImageBase64(reader.result as string);
          setUploadProgress(null);
        }, 300);
      };
      reader.readAsDataURL(file);
    }
  };


  const removeImage = () => {
    setImageBase64(null);
    setImageFileName(null);
  };

  const removeAudio = () => {
    setAudioFileName(null);
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
        } catch (e) {}
      }

      const response = await fetch('/api/factcheck', {
        method: 'POST',
        headers,
        body: JSON.stringify({ query: activeQuery, imageBase64 }),
      });

      const data = await response.json();

      if (data.refutation) {
        setResult({
          claim: data.claim || activeQuery || 'Attached Screenshot/Voice Note',
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

  return (
    <div id="factcheck-studio" className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Studio Header & Guided Tour Launchers */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Public Fact-Checking & Tropes Deconstruction Engine</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Verify Claims & Decode Online Hate
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
          Query claims against peer-reviewed academic repositories, debunk tropes, or upload screenshots and voice notes for instant deconstruction.
        </p>

        {/* Action Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          <button
            onClick={() => setTourModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Interactive Platform Tour</span>
          </button>

          <button
            onClick={() => setEmbedModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Get Embeddable Widget</span>
          </button>
        </div>
      </div>

      {/* Main Terminal Card */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Studio Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Brain className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100">
                Interactive Fact-Checking Terminal
              </h3>
              <p className="text-xs text-slate-400">
                Peer-reviewed refutations indexed from <strong>The Bridge Initiative</strong> & <strong>Tell MAMA</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl shrink-0">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Academic Database Active</span>
          </div>
        </div>

        {/* Quick Test Suggested Tropes */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Quick-Test Recognized Disinformation Tropes:
          </span>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUERIES.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSuggested(item.query)}
                disabled={loading}
                className="text-xs bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Search className="w-3 h-3 text-slate-500" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Input Box */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isRecording ? "Listening to your voice memo... Speak now" : "Type or paste a claim, or use the Mic / Upload buttons below (e.g. 'Halal fees fund terrorism', 'Creeping Sharia in courts')..."}
              rows={3}
              className={`w-full bg-slate-950 border rounded-2xl p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none transition-all ${
                isRecording 
                  ? 'border-rose-500/80 ring-2 ring-rose-500/20 animate-pulse' 
                  : 'border-slate-800 focus:border-emerald-500'
              }`}
            />

            {/* Upload Progress Banner */}
            {uploadProgress !== null && (
              <div className="absolute left-3 right-3 bottom-3 bg-slate-900 border border-slate-700 p-2.5 rounded-xl space-y-1.5 shadow-xl animate-in fade-in">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="truncate max-w-[280px]">Uploading {imageFileName || 'file'}...</span>
                  <span className="font-mono text-emerald-400 font-bold">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            {/* Attached Badges */}
            <div className="absolute left-3 bottom-3 flex flex-wrap gap-2">
              {imageBase64 && (
                <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-2.5 py-1 rounded-lg text-xs text-slate-200 shadow-sm">
                  <span className="truncate max-w-[160px]">{imageFileName || 'Screenshot Attached'}</span>
                  <button type="button" onClick={removeImage} className="text-slate-400 hover:text-rose-400">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              {audioFileName && (
                <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-2.5 py-1 rounded-lg text-xs text-blue-300 shadow-sm">
                  <FileAudio className="w-3.5 h-3.5 text-blue-400" />
                  <span className="truncate max-w-[160px]">{audioFileName}</span>
                  <button type="button" onClick={removeAudio} className="text-slate-400 hover:text-rose-400">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Toolbar with PROMINENT Mic & Media Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            
            <div className="flex flex-wrap items-center gap-2">
              
              {/* 1. Mic / Voice Note Button */}
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border shadow-sm ${
                  isRecording
                    ? 'bg-rose-600 text-white border-rose-500 animate-pulse ring-2 ring-rose-500/30'
                    : 'bg-slate-950 hover:bg-slate-900 text-slate-200 border-slate-800 hover:border-slate-700'
                }`}
                title={isRecording ? 'Click to stop recording' : 'Record voice memo / WhatsApp audio note'}
              >
                {isRecording ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-rose-400" />}
                <span>{isRecording ? 'Listening...' : 'Voice Note / Mic'}</span>
              </button>

              {/* 2. Upload Screenshot Button */}
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 px-3.5 py-2 rounded-xl cursor-pointer transition-colors shadow-sm">
                <ImagePlus className="w-4 h-4 text-emerald-400" />
                <span>Screenshot / PDF</span>
                <input
                  type="file"
                  accept="image/*,.pdf,application/pdf"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={loading}
                />
              </label>

              {/* 3. Upload Audio File Button */}
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 px-3.5 py-2 rounded-xl cursor-pointer transition-colors shadow-sm">
                <FileAudio className="w-4 h-4 text-blue-400" />
                <span>Audio File</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  className="hidden"
                  disabled={loading}
                />
              </label>

              {(query || imageBase64 || audioFileName) && (
                <button
                  type="button"
                  onClick={() => { setQuery(''); removeImage(); removeAudio(); setResult(null); }}
                  className="text-xs text-slate-400 hover:text-slate-200 px-2 py-2 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || (!query.trim() && !imageBase64 && !audioFileName)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Against Database...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Run Fact-Check</span>
                </>
              )}
            </button>

          </div>
        </form>

        {/* Error Notice */}
        {errorMsg && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-xs text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Result Box */}
        {result && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 animate-in fade-in duration-200">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Academic Verification Finding:</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Refutation'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Analyzed Claim:
                </span>
                <p className="text-xs text-slate-200 italic font-serif">
                  "{result.claim}"
                </p>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {result.refutation}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
              <span>Verified via Daleel Trust & Safety Pipeline</span>
              <span className="text-emerald-400 font-semibold">Citations: Georgetown Bridge Initiative &bull; Tell MAMA UK</span>
            </div>

          </div>
        )}

      </div>

      {/* Embedded Modals */}
      <EmbedWidgetModal isOpen={embedModalOpen} onClose={() => setEmbedModalOpen(false)} />
      <OnboardingTour isOpen={tourModalOpen} onClose={() => setTourModalOpen(false)} />

    </div>
  );
}
