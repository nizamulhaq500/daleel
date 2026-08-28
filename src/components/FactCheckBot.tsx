'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { X, Send, CheckCircle2, Brain, Loader2, ImagePlus, FileText, Twitter, Share2, Maximize2, Minimize2, Copy, Check } from 'lucide-react';

export default function FactCheckBot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [query, setQuery] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState(false);
  const [messages, setMessages] = useState<Array<{role: 'user' | 'bot', content: string, status?: 'verifying' | 'done', image?: string, claim?: string}>>([
    {
      role: 'bot',
      content: 'Salaam. I am the Daleel Fact-Checking Assistant. Ask me about any viral claim, dog-whistle, or anti-Muslim trope, or upload a screenshot to verify against factual research databases (Bridge Initiative, Tell MAMA, ISPU).',
      status: 'done'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    const handleOpenBot = () => setIsOpen(true);
    window.addEventListener('open-fact-check-bot', handleOpenBot);
    return () => window.removeEventListener('open-fact-check-bot', handleOpenBot);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(10);
      setAttachedFileName(file.name);
      const isPdfFile = file.type === 'application/pdf' || file.name.endsWith('.pdf');
      setIsPdf(isPdfFile);

      let p = 15;
      const interval = setInterval(() => {
        p += Math.floor(Math.random() * 25) + 15;
        if (p >= 90) {
          clearInterval(interval);
          setUploadProgress(95);
        } else {
          setUploadProgress(p);
        }
      }, 120);

      const reader = new FileReader();
      reader.onloadend = () => {
        clearInterval(interval);
        setUploadProgress(100);
        setTimeout(() => {
          setImageBase64(reader.result as string);
          setIsUploading(false);
          setUploadProgress(null);
        }, 300);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() && !imageBase64) return;

    const userMsg = query.trim();
    const currentImage = imageBase64;
    
    setQuery('');
    setImageBase64(null);
    setMessages(prev => [...prev, { role: 'user', content: userMsg, image: currentImage || undefined }]);
    setIsTyping(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (user) {
        try {
          const token = await user.getIdToken();
          if (token) headers['Authorization'] = `Bearer ${token}`;
        } catch (e) {
          // Token optional
        }
      }

      const response = await fetch('/api/factcheck', {
        method: 'POST',
        headers,
        body: JSON.stringify({ query: userMsg, imageBase64: currentImage }),
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: data.refutation || (data.error ? `Error: ${data.error}` : "I couldn't verify that claim in my current database."),
        claim: data.claim || userMsg || "Analyzed Content",
        status: 'done'
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: "Sorry, unable to connect to the fact-checking engine right now. Please try again shortly.",
        status: 'done'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const copyMessage = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // Dimensions based on maximized state
  const windowClasses = isMaximized 
    ? "fixed top-20 right-4 left-4 bottom-4 md:right-16 md:left-16 lg:left-1/2 lg:-translate-x-1/2 lg:w-[860px] h-[calc(100vh-100px)] max-h-none"
    : "fixed top-20 right-4 w-96 h-[580px] max-h-[82vh] origin-top-right";

  return (
    <div className="relative z-[100]">
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 bg-[#ede4d8] hover:bg-[#e4d8c9] dark:bg-[#0f172a] dark:hover:bg-slate-800 border border-[#dfd2bf] dark:border-slate-700 hover:border-[#c26e27] dark:hover:border-emerald-500/50 rounded-xl shadow-sm transition-all cursor-pointer ${isOpen ? 'border-[#c26e27] dark:border-emerald-500 ring-2 ring-[#c26e27]/20 dark:ring-emerald-500/20' : ''}`}
        title="Open Fact-Check Engine"
      >
        <Brain className={`w-4 h-4 ${isOpen ? 'text-[#c26e27] dark:text-emerald-400' : 'text-[#8c5324] dark:text-emerald-400'}`} />
        <span className="text-xs font-bold text-[#1e140d] dark:text-slate-200 hidden sm:block">Fact-Check Bot</span>
      </button>

      {/* Floating Modal Window */}
      <div 
        className={`${windowClasses} factcheck-window border rounded-2xl shadow-2xl flex flex-col transition-all duration-200 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b factcheck-header rounded-t-2xl shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/30">
              <Brain className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#1e140d] dark:text-slate-100">Daleel Fact-Check Engine</h3>
              <p className="text-[10px] text-[#705845] dark:text-slate-400 font-medium">Verified Disinformation Refutations</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setIsMaximized(!isMaximized)}
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              title={isMaximized ? "Restore window" : "Maximize window"}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat History Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 factcheck-body text-sm">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'bot' && (
                <div className="w-7 h-7 rounded-lg bg-[#ede2d3] dark:bg-slate-800 border border-[#dfd2bf] dark:border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Brain className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              )}
              
              <div className={`max-w-[85%] rounded-xl p-3.5 ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                  : 'factcheck-bot-bubble border rounded-tl-none space-y-2 shadow-sm'
              }`}>
                {msg.image && (
                  <div className="mb-2 rounded-lg overflow-hidden border border-slate-700 max-h-48">
                    <img src={msg.image} alt="Uploaded attachment" className="w-full object-cover" />
                  </div>
                )}

                {msg.claim && msg.role === 'bot' && (
                  <div className="text-[11px] font-semibold text-emerald-400/90 pb-1 border-b border-slate-800">
                    Claim: "{msg.claim}"
                  </div>
                )}

                <div className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
                  {msg.content}
                </div>

                {msg.role === 'bot' && idx > 0 && (
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <button
                      onClick={() => copyMessage(msg.content, idx)}
                      className="hover:text-slate-200 flex items-center gap-1 transition-colors"
                    >
                      {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start items-center text-slate-400 text-xs py-2">
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              </div>
              <span>Searching verified disinformation databases...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form Footer */}
        <form onSubmit={handleSubmit} className="p-3 border-t factcheck-footer space-y-2">
          {isUploading && uploadProgress !== null && (
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5 animate-in fade-in">
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span className="truncate max-w-[180px]">Uploading {attachedFileName}...</span>
                <span className="font-mono text-emerald-400 font-bold">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          {imageBase64 && !isUploading && (
            <div className="flex items-center justify-between bg-slate-800 px-2.5 py-1.5 rounded-xl text-xs text-slate-200 border border-slate-700">
              <div className="flex items-center gap-1.5 truncate max-w-[220px]">
                {isPdf ? <FileText className="w-3.5 h-3.5 text-rose-400 shrink-0" /> : <ImagePlus className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                <span className="truncate">{attachedFileName || (isPdf ? 'Document Attached' : 'Image Attached')}</span>
              </div>
              <button 
                type="button" 
                onClick={() => { setImageBase64(null); setAttachedFileName(null); }}
                className="text-slate-400 hover:text-red-400 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <label className="p-2 text-[#705845] dark:text-slate-400 hover:text-[#1e140d] dark:hover:text-slate-200 bg-[#ede2d3] dark:bg-slate-800 hover:bg-[#e4d5c3] dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors shrink-0" title="Attach screenshot or PDF document">
              <ImagePlus className="w-4 h-4" />
              <input 
                type="file" 
                accept="image/*,.pdf,application/pdf" 
                onChange={handleFileUpload} 
                className="hidden" 
                disabled={isTyping || isUploading}
              />
            </label>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about a claim, trope, or rumor..."
              disabled={isTyping}
              className="flex-1 factcheck-input border rounded-lg px-3.5 py-2 text-xs sm:text-sm placeholder-[#9c8571] dark:placeholder-slate-500 focus:outline-none focus:border-[#c26e27] dark:focus:border-emerald-500"
            />

            <button
              type="submit"
              disabled={isTyping || (!query.trim() && !imageBase64)}
              className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors disabled:opacity-50 shrink-0"
              title="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
