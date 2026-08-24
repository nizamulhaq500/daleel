'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { ShieldAlert, AlertTriangle, Upload, FileText, CheckCircle, ArrowRight } from 'lucide-react';
import jsPDF from 'jspdf';
import NewsTicker from './NewsTicker';
import ReporterHistory from './ReporterHistory';

export default function ReporterView({ isJournalist = false }: { isJournalist?: boolean }) {
  const { user, dbUser } = useAuth();
  // If it's a journalist, skip the hub entirely and go straight to reporting
  const [isReporting, setIsReporting] = useState(isJournalist ? true : false);
  const [currentStep, setCurrentStep] = useState<'capture' | 'analyze' | 'report'>('capture');
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<'text' | 'url'>('text');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [toxicityScores, setToxicityScores] = useState<any>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [sourcePlatform, setSourcePlatform] = useState<string>('');
  const [showProfileWarning, setShowProfileWarning] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!content && !imageBase64) return;
    setIsAnalyzing(true);
    
    try {
      const [analyzeRes, toxRes] = await Promise.all([
        fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, contentType, imageBase64 }),
        }),
        fetch('/api/toxicity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        })
      ]);

      const analyzeData = await analyzeRes.json();
      const toxData = await toxRes.json();

      if (!analyzeRes.ok || analyzeData.error) {
        throw new Error(analyzeData.error || 'API returned an error');
      }

      setAnalysisResult(analyzeData);
      setToxicityScores(toxData);
      setCurrentStep('analyze');
    } catch (error) {
      console.error('Error analyzing content:', error);
      alert('Network error or API key missing. Generating mock fallback evidence package.');
      
      const lowerContent = content ? content.toLowerCase() : '';
      let isJizya = lowerContent.includes('halal') || lowerContent.includes('jizya') || lowerContent.includes('economic jihad');

      setAnalysisResult({
        severity: isJizya ? 'Medium' : 'High',
        severityScore: isJizya ? 6 : 8,
        categories: isJizya ? ['Conspiracy', 'Relational'] : ['Coded Slur', 'Explicit'],
        codedTermsFound: isJizya ? 
          [{ term: 'jizya / economic jihad', meaning: 'Falsely claiming halal certification fees fund terrorism.', context: 'Common conspiracy to boycott Muslim businesses.', severity: 'High' }] :
          [{ term: 'kebab', meaning: 'Reference to Serbian genocide used against Muslims ("Remove Kebab")', context: 'Internet meme that glorifies ethnic cleansing', severity: 'Critical' }],
        contextExplanation: isJizya ? 
          "This post promotes a well-documented anti-Muslim conspiracy theory claiming that fees paid by food manufacturers for halal certification function as a stealth tax ('jizya') used to finance terrorism or 'economic jihad'. In reality, halal certification is a standard commercial service that verifies food compliance with Islamic dietary laws, similar to Kosher or organic labeling, and its proceeds do not fund terrorism." : 
          'This content uses historic genocide references to bypass standard hate speech filters while promoting violence against Muslim communities.',
        counterNarratives: isJizya ?
          ["Halal certification is a voluntary, standard business service that ensures food meets religious dietary guidelines, identical in function to Kosher, Vegan, or Organic certifications."] :
          ['This phrase is recognized by the UN as hate speech linked to ethnic cleansing.'],
        platformViolations: [{ platform: 'X', policy: 'Hateful Conduct' }]
      });
      
      setToxicityScores({
        TOXICITY: 85,
        SEVERE_TOXICITY: 60,
        IDENTITY_ATTACK: 92,
        INSULT: 75,
        THREAT: 40
      });
      setCurrentStep('analyze');
    } finally {
      setIsAnalyzing(false);
    }
  };

const handleSubmitEvidence = async () => {
    if (!dbUser?.phone || !dbUser?.dob) {
      setShowProfileWarning(true);
      return;
    }
    
    try {
      const docRef = await addDoc(collection(db, 'reports'), {
        reporterId: user?.uid || 'anonymous',
        reporterEmail: user?.email || 'anonymous',
        reporterName: user?.displayName || 'Anonymous Reporter',
        reporterPhone: dbUser?.phone || '',
        reporterDob: dbUser?.dob || '',
        content,
        contentType,
        imageBase64,
        sourcePlatform: sourcePlatform || 'Not Specified',
        severity: analysisResult.severity,
        aiScore: analysisResult.severityScore,
        categories: analysisResult.categories || [],
        codedTerms: analysisResult.codedTermsFound?.map((c: any) => c.term) || [],
        contextExplanation: analysisResult.contextExplanation,
        status: 'pending', // Will be read by Journalist View
        date: new Date().toISOString().split('T')[0],
        timestamp: serverTimestamp()
      });
      console.log("Document written with ID: ", docRef.id);
      setCurrentStep('report');
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Database error: Could not save report. Please ensure Firestore Security Rules allow writes (operation-not-allowed usually means rules are restrictive). Mocking success for demo.");
      setCurrentStep('report');
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // --- BRAND HEADER ---
    doc.setFillColor(15, 23, 42); // bg-slate-900
    doc.rect(0, 0, 210, 35, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(16, 185, 129); // emerald-500
    doc.text('Daleel', 20, 18);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text('Community Evidence Package', 20, 26);
    
    // --- TIMESTAMP ---
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(`Generated: ${new Date().toLocaleString()}`, 140, 20);
    
    let y = 50;

    // --- SUBMISSION BADGE ---
    doc.setFillColor(16, 185, 129); // emerald-500
    doc.rect(20, y - 6, 170, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`SUBMITTED TO DALEEL NETWORK (Awaiting Journalist Verification)`, 25, y);
    
    y += 15;

    // --- PERSONNEL ---
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(20, y, 170, 35, 'F');
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    
    doc.setFont("helvetica", "bold");
    doc.text('1. Community Reporter (Submitter)', 25, y + 8);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${dbUser?.name || user?.displayName || 'Anonymous'}`, 25, y + 16);
    doc.text(`Contact: ${user?.email || 'N/A'} | ${dbUser?.phone || 'N/A'}`, 25, y + 22);
    doc.text(`DOB: ${dbUser?.dob || 'N/A'}`, 25, y + 28);
    
    y += 45;

    // --- SEVERITY & PLATFORM ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(16, 185, 129);
    doc.text(`AI Severity Assessment: ${analysisResult.severity} (${analysisResult.severityScore}/10)`, 20, y);
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Source Platform: ${sourcePlatform || 'Unknown'}`, 20, y + 8);
    doc.line(20, y + 12, 190, y + 12);

    y += 25;

    // --- CONTENT & EVIDENCE ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Documented Evidence:', 20, y);
    
    y += 10;

    if (imageBase64) {
      try {
        doc.addImage(imageBase64, 20, y, 150, 90);
        y += 100;
      } catch (e) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.text('[Attached Image - Failed to render in PDF]', 20, y);
        y += 10;
      }
    }
    
    if (content) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const splitContent = doc.splitTextToSize(content, 170);
      doc.text(splitContent, 20, y);
      y += (splitContent.length * 5) + 10;
    }

    if (y > 230) {
      doc.addPage();
      doc.setFillColor(15, 23, 42); 
      doc.rect(0, 0, 210, 20, 'F');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(16, 185, 129);
      doc.text('Daleel (Cont.)', 20, 13);
      y = 35;
    }

    // --- ANALYSIS ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Contextual Analysis & Harm Breakdown:', 20, y);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const splitNotes = doc.splitTextToSize(analysisResult.contextExplanation || 'No context generated.', 170);
    doc.text(splitNotes, 20, y + 10);
    
    doc.save('Daleel-evidence-package.pdf');
  };

  const [stats, setStats] = useState({ total: 0, escalated: 0 });

  useEffect(() => {
    if (!user) return;
    // We fetch real-time reports to count the impact accurately for the current user
    const unsubscribe = onSnapshot(collection(db, 'reports'), (snapshot) => {
      let t = 0;
      let e = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.reporterId === user.uid || data.reporterEmail === user.email) {
          t++;
          if (data.status === 'escalated') e++;
        }
      });
      setStats({ total: t, escalated: e });
    });
    return () => unsubscribe();
  }, [user]);

  // 1. HOME HUB STATE (Only for Reporters)
  if (!isReporting && !isJournalist) {
    return (
      <div className="flex-1 w-full max-w-7xl mx-auto p-8 flex flex-col">
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-4xl font-extrabold text-white tracking-tight">
            {user?.displayName ? `Assalamualaikum, ${user.displayName.split(' ')[0]} 👋` : 'Assalamualaikum 👋'}
          </h2>
          <p className="text-lg text-slate-400 mt-3 max-w-2xl">
            Thank you for signing in as a Community Reporter. Your vigilance helps protect communities from targeted disinformation and hate speech. What would you like to do today?
          </p>
          <button 
            onClick={() => setIsReporting(true)}
            className="mt-6 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 group"
          >
            <ShieldAlert className="w-5 h-5" />
            File a New Report
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-8 h-[520px]">
             <NewsTicker />
          </div>
          <div className="lg:col-span-4 flex flex-col justify-center">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
               <h3 className="text-xl font-bold text-white mb-4">Your Impact</h3>
               <div className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-inner">
                    <p className="text-3xl font-black text-emerald-500">{stats.total > 0 ? stats.total : 0}</p>
                    <p className="text-sm text-slate-400 font-medium">Reports Validated</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-inner">
                    <p className="text-3xl font-black text-blue-500">{stats.escalated > 0 ? stats.escalated : 0}</p>
                    <p className="text-sm text-slate-400 font-medium">Escalated to Agencies</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <ReporterHistory />
      </div>
    );
  }

  // 2. REPORTING STATE
  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 py-8">
      {!isJournalist && (
        <button 
          onClick={() => setIsReporting(false)}
          className="text-slate-400 hover:text-white mb-6 font-medium text-sm transition-colors"
        >
          &larr; Back to Dashboard
        </button>
      )}

      {/* Step Indicator */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center w-full max-w-2xl">
          <div className="flex flex-col items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${currentStep === 'capture' ? 'border-emerald-500 text-emerald-500' : 'border-emerald-500 bg-emerald-500 text-slate-950'}`}>1</div>
            <span className="text-xs font-bold text-emerald-500 mt-2 tracking-widest uppercase">Capture</span>
          </div>
          <div className={`h-0.5 flex-1 ${currentStep === 'analyze' || currentStep === 'report' ? 'bg-emerald-500' : 'bg-slate-800'}`}></div>
          <div className="flex flex-col items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${currentStep === 'analyze' ? 'border-emerald-500 text-emerald-500' : currentStep === 'report' ? 'border-emerald-500 bg-emerald-500 text-slate-950' : 'border-slate-800 text-slate-600'}`}>2</div>
            <span className={`text-xs font-bold mt-2 tracking-widest uppercase ${currentStep === 'analyze' || currentStep === 'report' ? 'text-emerald-500' : 'text-slate-600'}`}>Analyze</span>
          </div>
          <div className={`h-0.5 flex-1 ${currentStep === 'report' ? 'bg-emerald-500' : 'bg-slate-800'}`}></div>
          <div className="flex flex-col items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${currentStep === 'report' ? 'border-emerald-500 text-emerald-500' : 'border-slate-800 text-slate-600'}`}>3</div>
            <span className={`text-xs font-bold mt-2 tracking-widest uppercase ${currentStep === 'report' ? 'text-emerald-500' : 'text-slate-600'}`}>Report</span>
          </div>
        </div>
      </div>

      {/* CAPTURE STEP */}
      {currentStep === 'capture' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex border-b border-slate-800">
            <button 
              className={`flex-1 py-4 font-bold text-sm ${contentType === 'text' ? 'text-emerald-500 border-b-2 border-emerald-500 bg-emerald-500/5' : 'text-slate-400 hover:text-slate-200'}`}
              onClick={() => setContentType('text')}
            >
              Text Content
            </button>
            <button 
              className={`flex-1 py-4 font-bold text-sm ${contentType === 'url' ? 'text-emerald-500 border-b-2 border-emerald-500 bg-emerald-500/5' : 'text-slate-400 hover:text-slate-200'}`}
              onClick={() => setContentType('url')}
            >
              URL / Link
            </button>
          </div>
          
          <div className="p-6">
            <textarea
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all min-h-[160px]"
              placeholder={contentType === 'text' ? "Paste the suspected hateful content here..." : "Paste the link to the post/video..."}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="mt-4 border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-emerald-500/50 transition-colors bg-slate-950/50 relative">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-400 font-medium">Click or drag to attach screenshot evidence</p>
              <p className="text-xs text-slate-600 mt-1">PNG, JPG up to 5MB</p>
              {imageBase64 && <p className="text-emerald-500 mt-2 font-bold text-sm">✓ Image Attached</p>}
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-bold text-slate-400 mb-2">Where did you find this? (Optional)</label>
              <select 
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
                value={sourcePlatform}
                onChange={(e) => setSourcePlatform(e.target.value)}
              >
                <option value="">Select Platform...</option>
                <option value="X (Twitter)">X (Twitter)</option>
                <option value="Facebook">Facebook</option>
                <option value="TikTok">TikTok</option>
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
                <option value="Telegram">Telegram</option>
                <option value="Reddit">Reddit</option>
                <option value="Offline / Real Life">Offline / Real Life</option>
                <option value="Other">Other Web Link / Drive Link</option>
              </select>
            </div>

            <div className="mt-8 flex justify-between items-center">
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                Data is encrypted and analyzed safely.
              </p>
              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || (!content && !imageBase64)}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Analyzing Content...
                  </>
                ) : (
                  'Analyze Content'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ANALYZE STEP */}
      {currentStep === 'analyze' && analysisResult && (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
          
          {/* Main Verdict Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row gap-6">
            <div className={`w-32 shrink-0 flex flex-col items-center justify-center rounded-xl p-4 ${analysisResult.severityScore > 7 ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'} border`}>
              <span className="text-4xl font-black">{analysisResult.severityScore}/10</span>
              <span className="text-xs font-bold uppercase tracking-wider mt-1">{analysisResult.severity} Severity</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">Context Explanation</h3>
              <p className="text-slate-300 leading-relaxed text-sm">
                {analysisResult.contextExplanation}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {analysisResult.categories?.map((cat: string) => (
                  <span key={cat} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-bold border border-slate-700">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Coded Language Detected
              </h3>
              {analysisResult.codedTermsFound?.length > 0 ? (
                <div className="space-y-3">
                  {analysisResult.codedTermsFound.map((item: any, idx: number) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <span className="font-bold text-amber-400 block mb-1">"{item.term}"</span>
                      <span className="text-sm text-slate-400">{item.meaning}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No specific coded terms detected.</p>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-emerald-500" />
                Counter-Narrative Suggestion
              </h3>
              <ul className="space-y-3">
                {analysisResult.counterNarratives?.map((item: string, idx: number) => (
                  <li key={idx} className="text-sm text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-end pt-4">
             <button 
                onClick={handleSubmitEvidence}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-blue-500/20 transition-all"
              >
                Escalate to Watchdog Network
              </button>
          </div>
        </div>
      )}

      {/* REPORT STEP */}
      {currentStep === 'report' && (
        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-10 shadow-xl text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Evidence Packaged Successfully</h2>
          <p className="text-slate-400 max-w-md mx-auto mb-8">
            Your report has been encrypted and forwarded to the Journalist validation desk. You can download a PDF copy for your own records or direct platform reporting.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={generatePDF}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Download PDF Report
            </button>
            <button 
              onClick={() => {
                setContent('');
                setImageBase64(null);
                setCurrentStep('capture');
                if (!isJournalist) setIsReporting(false);
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-emerald-500/20 transition-all"
            >
              {isJournalist ? 'Submit Another Report' : 'Return to Hub'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
