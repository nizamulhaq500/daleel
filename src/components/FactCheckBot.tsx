'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, ShieldAlert, CheckCircle, Brain, Loader2, ImagePlus, Twitter, Facebook, Share2, Maximize2, Minimize2 } from 'lucide-react';

export default function FactCheckBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [query, setQuery] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [messages, setMessages] = useState<Array<{role: 'user' | 'bot', content: string, status?: 'verifying' | 'done', image?: string, claim?: string}>>([
    {
      role: 'bot',
      content: 'Salaam. I am the Daleel Fact-Checking Assistant. Ask me about any viral claim, dog-whistle, or Islamophobic trope, or upload an image/PDF screenshot to analyze, and I will provide factual refutations based on verified research databases.',
      status: 'done'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const handleOpenBot = () => setIsOpen(true);
    window.addEventListener('open-fact-check-bot', handleOpenBot);
    return () => window.removeEventListener('open-fact-check-bot', handleOpenBot);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        // Simulate a slight delay to show the upload animation
        setTimeout(() => {
          setImageBase64(reader.result as string);
          setIsUploading(false);
        }, 800);
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
      const response = await fetch('/api/factcheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg, imageBase64: currentImage }),
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: data.refutation || "I couldn't verify that claim in my current database.",
        claim: data.claim || userMsg || "Analyzed Content",
        status: 'done'
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: "Sorry, I lost connection to the fact-checking database. Please try again later.",
        status: 'done'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Dimensions based on maximized state
  const windowClasses = isMaximized 
    ? "fixed top-24 right-6 left-6 bottom-6 md:right-24 md:left-24 lg:left-1/2 lg:-translate-x-1/2 lg:w-[800px] h-[calc(100vh-120px)] max-h-none"
    : "fixed top-24 right-6 w-96 h-[600px] max-h-[80vh] origin-top-right";

  return (
    <div className="relative z-[100]">
      {/* Navbar Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 bg-[#020617]/50 border border-white/5 shadow-2xl backdrop-blur-md border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800 rounded-lg transition-all ${isOpen ? 'border-emerald-500 bg-emerald-500/10' : ''}`}
      >
        <Brain className={`w-5 h-5 ${isOpen ? 'text-emerald-500' : 'text-slate-400'}`} />
        <span className="text-sm font-bold text-white hidden sm:block">Fact-Check</span>
      </button>

      {/* Chat Window */}
      <div 
        className={`${windowClasses} bg-[#020617]/50 border border-white/5 shadow-2xl backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-[#020617]/40 border border-white/5 shadow-2xl backdrop-blur-md rounded-t-2xl shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/30">
              <Brain className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Fact-Check Engine</h3>
              <p className="text-[10px] text-slate-400 font-mono">Sync: Verified Databases</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMaximized(!isMaximized)}
              className="text-slate-400 hover:text-emerald-400 transition-colors p-1"
              title={isMaximized ? "Minimize" : "Maximize"}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-red-400 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#020617]/50 border border-white/5 shadow-2xl backdrop-blur-md">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4 text-emerald-500" />
                </div>
              )}
              
              <div className={`max-w-[85%] flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`rounded-2xl p-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'}`}>
                  {msg.role === 'bot' && idx > 0 && (
                    <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      <CheckCircle className="w-3 h-3" /> Fact Check
                    </div>
                  )}
                  {msg.image && (
                    msg.image.startsWith('data:image/') ? (
                      <img src={msg.image} alt="Upload" className="max-w-full h-auto rounded-lg mb-2 border border-slate-700/50" />
                    ) : (
                      <div className="flex items-center gap-2 mb-2 p-2 bg-slate-800/50 rounded-lg border border-slate-700/50 text-emerald-400 text-xs font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                        Document Attached
                      </div>
                    )
                  )}
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>

                {/* Share Buttons for Bot responses (excluding the first welcome message if preferred, but we can just show it for all refutations) */}
                {msg.role === 'bot' && idx > 0 && (
                  <div className="flex items-center gap-2 mt-1 pl-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">Share Fact:</span>
                    <a 
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Fact Check:\n\nClaim: ${msg.claim}\n\nRefutation: ${msg.content.substring(0, 150)}...\n\nVerified by Daleel Threat Intelligence`)}`}
                      target="_blank" rel="noreferrer"
                      className="p-1.5 bg-slate-800 hover:bg-[#1DA1F2]/20 text-slate-400 hover:text-[#1DA1F2] rounded-md transition-colors"
                      title="Share to X"
                    >
                      <Twitter className="w-3.5 h-3.5" />
                    </a>
                    <a 
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://daleel.example.com')}&quote=${encodeURIComponent(`Fact Check: Claim: ${msg.claim} - Refutation: ${msg.content.substring(0, 150)}...`)}`}
                      target="_blank" rel="noreferrer"
                      className="p-1.5 bg-slate-800 hover:bg-[#4267B2]/20 text-slate-400 hover:text-[#4267B2] rounded-md transition-colors"
                      title="Share to Facebook"
                    >
                      <Facebook className="w-3.5 h-3.5" />
                    </a>
                    <a 
                      href={`https://www.reddit.com/submit?title=${encodeURIComponent(`Fact Check: ${msg.claim}`)}&text=${encodeURIComponent(msg.content)}`}
                      target="_blank" rel="noreferrer"
                      className="p-1.5 bg-slate-800 hover:bg-[#FF4500]/20 text-slate-400 hover:text-[#FF4500] rounded-md transition-colors"
                      title="Share to Reddit"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <Brain className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                <span className="text-xs text-slate-400 font-mono">Querying verified databases...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-[#020617]/40 border border-white/5 shadow-2xl backdrop-blur-md border-t border-slate-800 rounded-b-2xl flex flex-col gap-2">
          {isUploading && (
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-800 rounded-t-2xl overflow-hidden">
              <div className="h-full bg-emerald-500 w-1/2 animate-[bounce_1s_infinite_ease-in-out_alternate]"></div>
            </div>
          )}
          
          {imageBase64 && (
             <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-emerald-500 bg-slate-800 flex items-center justify-center shrink-0">
               {imageBase64.startsWith('data:image/') ? (
                 <img src={imageBase64} alt="Preview" className="w-full h-full object-cover opacity-70" />
               ) : (
                 <div className="flex flex-col items-center justify-center text-emerald-500">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                   <span className="text-[8px] font-bold mt-1 uppercase">Doc</span>
                 </div>
               )}
               <button onClick={() => setImageBase64(null)} className="absolute top-1 right-1 bg-[#020617]/50 border border-white/5 shadow-2xl backdrop-blur-md rounded-full p-0.5"><X className="w-3 h-3 text-white" /></button>
             </div>
          )}
          <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about a claim or trope..."
                className="w-full bg-[#020617]/50 border border-white/5 shadow-2xl backdrop-blur-md border border-slate-700 text-slate-200 text-sm rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                disabled={isUploading}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                 <label className="cursor-pointer p-1.5 text-slate-400 hover:text-emerald-400 transition-colors block">
                    <input type="file" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                    {isUploading ? <Loader2 className="w-5 h-5 animate-spin text-emerald-500" /> : <ImagePlus className="w-5 h-5" />}
                 </label>
              </div>
            </div>
            <button 
              type="submit"
              disabled={(!query.trim() && !imageBase64) || isTyping || isUploading}
              className="p-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white rounded-xl transition-colors shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="mt-1 text-center shrink-0">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest">Powered by Daleel Intelligence</span>
          </div>
        </div>
      </div>
    </div>
  );
}
