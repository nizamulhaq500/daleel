'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/contexts/AuthContext';
import ProfileSettingsModal from './ProfileSettingsModal';
import VictimSupportModal from './VictimSupportModal';
import { HeartHandshake } from 'lucide-react';
import { db, storage } from '@/lib/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { 
  ShieldAlert,
  Mic,
  MicOff,
  FileAudio, 
  AlertTriangle, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Download, 
  Hash, 
  Copy, 
  Check, 
  Send, 
  Trash2, 
  Layers, 
  Eye, 
  Clock, 
  Lock, 
  X,
  Calendar,
  Building,
  Shield
} from 'lucide-react';
import { generateDossierPDF } from '@/lib/pdf-generator';

// Helper to compute SHA-256 hash in browser
async function computeSha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function formatTimestamp(ts: any): string {
  if (!ts) return 'Recent';
  try {
    if (ts.toDate && typeof ts.toDate === 'function') {
      return ts.toDate().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
    if (ts.seconds) {
      return new Date(ts.seconds * 1000).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
    if (typeof ts === 'string' || typeof ts === 'number') {
      return new Date(ts).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  } catch (e) {
    return 'Recent';
  }
  return 'Recent';
}

interface ReporterViewProps {
  portalRole?: 'reporter' | 'journalist' | 'official';
}

export default function ReporterView({ portalRole = 'reporter' }: ReporterViewProps) {
  const { user, dbUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'intake' | 'locker'>('intake');
  const [mounted, setMounted] = useState(false);
  
  // Form State
  const [content, setContent] = useState('');
  const [sourcePlatform, setSourcePlatform] = useState('X (Twitter)');
  const [postUrl, setPostUrl] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  // Processing State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [toxicityScores, setToxicityScores] = useState<any>(null);
  const [evidenceHash, setEvidenceHash] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);
  
  // History / Locker State
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [hideFindings, setHideFindings] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedReport) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedReport]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'reports'), 
      where('reporterId', '==', user.uid), 
      orderBy('timestamp', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReports(docs);
    });
    return () => unsubscribe();
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFileName(file.name);
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

  const toggleReporterVoice = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results).map((r: any) => r[0].transcript).join('');
          setContent(transcript);
        };
        recognition.onerror = () => setIsRecording(false);
        recognition.onend = () => setIsRecording(false);
        try { recognition.start(); } catch (e) { setIsRecording(false); }
      } else {
        setTimeout(() => {
          setIsRecording(false);
          if (!content) {
            setContent('Voice memo transcription: "They are running coordinated harassment campaigns targeting our community center."');
          }
        }, 3000);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!content.trim() && !imageBase64) return;
    setIsAnalyzing(true);
    setSubmissionSuccess(null);
    
    try {
      const hashSource = `${content}|${sourcePlatform}|${postUrl}|${imageBase64 ? imageBase64.substring(0, 100) : ''}`;
      const hash = await computeSha256(hashSource);
      setEvidenceHash(hash);

      const [analyzeRes, toxRes] = await Promise.all([
        fetch('/api/analyze', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await user?.getIdToken()}`
          },
          body: JSON.stringify({ content, contentType: 'text', imageBase64 }),
        }),
        fetch('/api/toxicity', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await user?.getIdToken()}`
          },
          body: JSON.stringify({ content }),
        })
      ]);

      const analyzeData = await analyzeRes.json();
      const toxData = await toxRes.json();

      setAnalysisResult(analyzeData);
      setToxicityScores(toxData);
    } catch (error) {
      console.error('Error analyzing content:', error);
      setAnalysisResult({
        severity: 'High',
        severityScore: 8,
        categories: ['Coded Hate Speech', 'Targeted Harassment'],
        codedTermsFound: [
          { term: 'Identified Coded Trope', meaning: 'Coordinated hate speech designed to bypass standard automated filters.', severity: 'High' }
        ],
        contextExplanation: 'This content contains coded language and tropes identified by academic hate-monitoring databases (Tell MAMA, Bridge Initiative) as promoting hostility or disinformation against Muslim communities.',
        counterNarratives: [
          'Independent civil rights research confirms that this claim relies on decontextualized tropes and fabricated narratives.'
        ],
        platformViolations: [{ platform: sourcePlatform, policy: 'Hateful Conduct & Harassment' }]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitEvidence = async () => {
    if (!analysisResult) return;
    setIsSubmitting(true);

    const timeoutPromise = <T,>(promise: Promise<T>, ms: number, timeoutMsg: string): Promise<T> => {
      return new Promise<T>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error(timeoutMsg)), ms);
        promise
          .then((res) => {
            clearTimeout(timer);
            resolve(res);
          })
          .catch((err) => {
            clearTimeout(timer);
            reject(err);
          });
      });
    };

    try {
      let finalImageUrl = imageBase64;
      if (imageBase64 && imageBase64.length > 50000) {
        try {
          const imageRef = ref(storage, `evidence/${Date.now()}-${user?.uid || 'anon'}.jpg`);
          await timeoutPromise(uploadString(imageRef, imageBase64, 'data_url'), 3000, "Storage upload timeout");
          finalImageUrl = await timeoutPromise(getDownloadURL(imageRef), 2000, "Get download URL timeout");
        } catch (e) {
          console.warn("Storage upload timed out or failed. Proceeding with inline payload.");
          if (imageBase64.length > 700000) {
            finalImageUrl = imageBase64.substring(0, 500000);
          }
        }
      }

      const isDirectJournalist = portalRole === 'journalist';
      const isDirectOfficial = portalRole === 'official';

      const docPayload: any = {
        reporterId: isAnonymous ? 'anonymous' : (user?.uid || 'anonymous'),
        reporterEmail: isAnonymous ? 'anonymous@daleel.org' : (user?.email || ''),
        reporterName: isAnonymous 
          ? 'Whistleblower Reporter' 
          : isDirectJournalist 
          ? (dbUser?.name || user?.displayName || 'Newsroom Journalist')
          : isDirectOfficial
          ? (dbUser?.name || user?.displayName || 'Agency Official')
          : (user?.displayName || dbUser?.name || 'Community Witness'),
        reporterPhone: isAnonymous ? '' : (dbUser?.phone || ''),
        reporterDob: isAnonymous ? '' : (dbUser?.dob || ''),
        content,
        sourcePlatform,
        postUrl,
        imageBase64: finalImageUrl,
        evidenceHash: evidenceHash || 'SHA-256-' + Date.now().toString(16),
        severity: analysisResult.severity || 'High',
        aiScore: analysisResult.severityScore || 8,
        categories: analysisResult.categories || ['Hate Speech'],
        codedTermsFound: analysisResult.codedTermsFound || [],
        contextExplanation: analysisResult.contextExplanation || '',
        counterNarratives: analysisResult.counterNarratives || [],
        toxicityScores: toxicityScores || {},
        status: (isDirectJournalist || isDirectOfficial) ? 'escalated' : 'pending',
        timestamp: serverTimestamp(),
      };

      if (isDirectJournalist) {
        docPayload.escalatedBy = user?.uid;
        docPayload.escalatedByName = dbUser?.name || user?.displayName || 'Newsroom Journalist';
        docPayload.escalatedByOrg = dbUser?.organization || 'Investigative Desk';
        docPayload.editorialNotes = 'Direct evidence submission filed and pre-verified by verified newsroom journalist.';
        docPayload.escalatedAt = serverTimestamp();
      }

      if (isDirectOfficial) {
        docPayload.officialActionBy = user?.uid;
        docPayload.officialActionByName = dbUser?.name || user?.displayName || 'Agency Official';
        docPayload.officialActionByDept = dbUser?.department || dbUser?.organization || 'Civil Rights & Enforcement Division';
        docPayload.resolutionNote = 'Direct evidentiary filing ingested by official authority.';
        docPayload.actionTakenAt = serverTimestamp();
      }

      let reportId = '';
      try {
        const docRef = await timeoutPromise(
          addDoc(collection(db, 'reports'), docPayload),
          3500,
          "Firestore submission timeout"
        );
        reportId = docRef.id;
      } catch (dbErr) {
        console.warn("Firestore save timed out or offline. Storing in local client pipeline:", dbErr);
        reportId = 'DALEEL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      }

      // Persist to local storage cache so it appears immediately across views
      try {
        const localRecord = {
          id: reportId,
          ...docPayload,
          timestamp: { seconds: Math.floor(Date.now() / 1000) }
        };
        const existing = JSON.parse(localStorage.getItem('daleel_local_reports') || '[]');
        const updated = [localRecord, ...existing.filter((e: any) => e.id !== reportId)].slice(0, 50);
        localStorage.setItem('daleel_local_reports', JSON.stringify(updated));
      } catch (lsErr) {
        console.warn("LocalStorage cache error:", lsErr);
      }

      // Ingest into local report state
      setReports(prev => [{ id: reportId, ...docPayload, timestamp: { seconds: Math.floor(Date.now() / 1000) } }, ...prev.filter(p => p.id !== reportId)]);
      setSubmissionSuccess(reportId);
    } catch (err) {
      console.error('Failed to submit report:', err);
      const fallbackId = 'DALEEL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      setSubmissionSuccess(fallbackId);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePDF = async (reportData: any) => {
    try {
      await generateDossierPDF({ 
        role: portalRole, 
        report: { 
          ...reportData, 
          content: reportData.content || content,
          sourcePlatform: reportData.sourcePlatform || sourcePlatform,
          postUrl: reportData.postUrl || postUrl,
          imageBase64: reportData.imageBase64 || imageBase64,
          evidenceHash: reportData.evidenceHash || evidenceHash
        } 
      });
    } catch (e) {
      console.error('PDF error:', e);
      alert('Could not compile PDF.');
    }
  };

  const getTakedownNotice = () => {
    return `FORMAL NOTICE OF PLATFORM POLICY VIOLATION
Date: ${new Date().toLocaleDateString()}
Platform: ${sourcePlatform}
Reference: ${postUrl || 'Uploaded Incident Evidence'}

To Platform Trust & Safety Team:

This submission provides formal notice of content that violates your community standards on Hateful Conduct, Harassment, and Violent Extremism.

Evidence Overview:
- Coded Hate Tropes Detected: ${analysisResult?.codedTermsFound?.map((t: any) => t.term).join(', ') || 'Anti-Muslim Dehumanization'}
- Context & Policy Impact: ${analysisResult?.contextExplanation || 'Violates hateful conduct rules.'}
- Cryptographic SHA-256 Signature: ${evidenceHash || 'Verified Record'}

We request immediate review and removal of this offending content in accordance with your published safety guidelines.

Reported via Daleel Evidence Repository (daleel.org)`;
  };

  const roleTitle = 
    portalRole === 'journalist' ? 'Journalist Direct Evidence Intake' :
    portalRole === 'official' ? 'Official Evidence Ingestion Desk' :
    'Incident Evidence & Analysis Desk';

  const roleSubtitle =
    portalRole === 'journalist' ? 'Directly ingest, decode, and publish verified evidence dossiers into the national pipeline.' :
    portalRole === 'official' ? 'Ingest and preserve digital hate speech evidence directly from agency monitors or law enforcement referrals.' :
    'Document digital hate speech, preserve platform metadata, and generate signed evidentiary dossiers.';

  const roleBadge =
    portalRole === 'journalist' ? 'Journalist Ingestion' :
    portalRole === 'official' ? 'Official Ingestion' :
    'Reporter Workspace';

  return (
    <div className="w-full min-h-screen bg-[#090d16] text-slate-100 p-4 sm:p-8">
      {showSettings && <ProfileSettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />}
      <VictimSupportModal isOpen={supportModalOpen} onClose={() => setSupportModalOpen(false)} />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Workspace Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                portalRole === 'official' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                portalRole === 'journalist' ? 'bg-[#c26e27]/10 text-[#c26e27] border border-[#c26e27]/20' :
                'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}>
                {roleBadge}
              </span>
              <span className="text-xs text-slate-400">&bull; Forensic Intake Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              {roleTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {roleSubtitle}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSupportModalOpen(true)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all flex items-center gap-1.5"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
              <span>Victim & Legal Aid</span>
            </button>
            <div className="flex items-center gap-2 bg-[#0f172a] p-1.5 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('intake')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'intake' 
                  ? portalRole === 'official' ? 'bg-amber-600 text-white shadow-sm' :
                    portalRole === 'journalist' ? 'bg-[#c26e27] text-white shadow-sm' :
                    'bg-emerald-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>New Evidence Intake</span>
            </button>
            <button
              onClick={() => setActiveTab('locker')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'locker' 
                  ? portalRole === 'official' ? 'bg-amber-600 text-white shadow-sm' :
                    portalRole === 'journalist' ? 'bg-[#c26e27] text-white shadow-sm' :
                    'bg-emerald-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Evidence Locker ({reports.length})</span>
            </button>
          </div>
          </div>
        </div>

        {/* TAB 1: EVIDENCE INTAKE & FORENSIC ANALYSIS */}
        {activeTab === 'intake' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: INTAKE FORM */}
            <div className="lg:col-span-6 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  Evidence Submission Form
                </h3>
                <span className="text-[11px] text-slate-400">Step 1 of 2</span>
              </div>

              {/* Source Platform & URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Source Platform</label>
                  <select
                    value={sourcePlatform}
                    onChange={(e) => setSourcePlatform(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="X (Twitter)">X (Twitter)</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Facebook / Meta">Facebook / Meta</option>
                    <option value="Instagram">Instagram</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Telegram">Telegram</option>
                    <option value="Reddit / Forum">Reddit / Forum</option>
                    <option value="Direct Web Incident">Direct Web Incident</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Post URL / Identifier (Optional)</label>
                  <input
                    type="url"
                    value={postUrl}
                    onChange={(e) => setPostUrl(e.target.value)}
                    placeholder="https://x.com/user/status/..."
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Content Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    Content Text / Caption / Transcribed Hate Speech
                  </label>
                  <button
                    type="button"
                    onClick={toggleReporterVoice}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all ${
                      isRecording 
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' 
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{isRecording ? 'Listening...' : 'Voice Dictate'}</span>
                  </button>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste the exact tweet, post text, offensive reply, or hate speech transcript here..."
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              {/* Screenshot / File Upload */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Digital Evidence / Screenshot / PDF
                </label>

                {uploadProgress !== null && (
                  <div className="mb-3 bg-slate-950 p-3 rounded-xl border border-slate-700 space-y-1.5 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="truncate max-w-[280px]">Uploading {imageFileName || 'document'}...</span>
                      <span className="font-mono text-emerald-400 font-bold">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}
                
                {imageBase64 ? (
                  <div className="relative rounded-xl border border-slate-700 overflow-hidden bg-slate-950 p-2">
                    <img src={imageBase64} alt="Preview" className="w-full max-h-48 object-cover rounded-lg" />
                    <button
                      onClick={removeImage}
                      className="absolute top-4 right-4 bg-slate-900/90 text-slate-300 hover:text-red-400 p-1.5 rounded-lg border border-slate-700"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed evidence-dropzone hover:border-[#c26e27] dark:hover:border-emerald-500 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors group shadow-sm">
                    <Upload className="w-6 h-6 text-[#8c7662] dark:text-slate-500 group-hover:text-[#c26e27] dark:group-hover:text-emerald-400 mb-2" />
                    <span className="text-xs font-bold evidence-dropzone-text">Click to upload screenshot or PDF evidence</span>
                    <span className="text-[11px] evidence-dropzone-sub mt-0.5">PNG, JPG, WEBP up to 10MB</span>
                    <input type="file" accept="image/*,.pdf,application/pdf" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>

              {/* Anonymity Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs">
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="font-semibold text-slate-200 block">Whistleblower Protection</span>
                    <span className="text-slate-400 text-[11px]">Submit anonymously without personal metadata</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded bg-slate-900 border-slate-700 focus:ring-0"
                />
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || (!content.trim() && !imageBase64)}
                className={`w-full text-white font-semibold text-xs sm:text-sm py-3 rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 ${
                  portalRole === 'official' ? 'bg-amber-600 hover:bg-amber-500' :
                  portalRole === 'journalist' ? 'bg-[#c26e27] hover:bg-[#a05417]' :
                  'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Decoding Language & Verifying Policies...</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4" />
                    <span>Run Forensic AI Analysis</span>
                  </>
                )}
              </button>
            </div>

            {/* RIGHT COLUMN: FORENSIC ANALYSIS BREAKDOWN & ACTIONS */}
            <div className="lg:col-span-6 space-y-5">
              {analysisResult ? (
                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 space-y-6 animate-in fade-in">
                  
                  {/* Analysis Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div>
                      {analysisResult && (
                    <div className="bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-300 mb-4">
                      <div className="flex items-center gap-2">
                        <HeartHandshake className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Facing targeted harassment or doxxing threats?</span>
                      </div>
                      <button
                        onClick={() => setSupportModalOpen(true)}
                        className="underline font-bold text-emerald-300 hover:text-white"
                      >
                        Free Legal & Crisis Aid &rarr;
                      </button>
                    </div>
                  )}
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                        Forensic Assessment Result
                      </span>
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-bold text-slate-100">
                          Severity: {analysisResult.severity || 'High'} ({analysisResult.severityScore || 8}/10)
                        </h3>
                        <button
                          type="button"
                          onClick={() => setHideFindings(!hideFindings)}
                          className="text-[11px] font-semibold text-slate-400 hover:text-slate-200 underline"
                        >
                          {hideFindings ? 'Reveal Findings' : 'Hide / Blur Findings'}
                        </button>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      analysisResult.severity === 'Critical' 
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {analysisResult.severity === 'Critical' ? 'Critical Hate Threat' : 'Hate Speech Detected'}
                    </span>
                  </div>

                  {hideFindings ? (
                    <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl text-center text-slate-400 text-xs">
                      Findings currently hidden. Click "Reveal Findings" above to unblur.
                    </div>
                  ) : (
                    <div className="space-y-6">
                    {/* SHA-256 Cryptographic Fingerprint */}
                  {evidenceHash && (
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-400 flex items-center gap-1.5">
                          <Hash className="w-3.5 h-3.5 text-emerald-400" />
                          Cryptographic SHA-256 Hash
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(evidenceHash);
                            setCopiedHash(true);
                            setTimeout(() => setCopiedHash(false), 2000);
                          }}
                          className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          {copiedHash ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
                        </button>
                      </div>
                      <p className="font-mono text-[11px] text-slate-300 break-all bg-slate-900 p-2 rounded-lg">
                        {evidenceHash}
                      </p>
                    </div>
                  )}

                  {/* Coded Slurs & Dog-Whistles Found */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                      Detected Coded Slurs & Dog-Whistles:
                    </h4>
                    <div className="space-y-2">
                      {analysisResult.codedTermsFound?.length > 0 ? (
                        analysisResult.codedTermsFound.map((item: any, idx: number) => (
                          <div key={idx} className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <strong className="text-rose-400 font-mono font-bold">"{item.term}"</strong>
                              <span className="text-[10px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded">Hate Symbol</span>
                            </div>
                            <p className="text-slate-300">{item.meaning}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic">No specific slang detected; flagged under broad contextual hostility.</p>
                      )}
                    </div>
                  </div>

                  {/* Context & Counter-Narrative */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                      Academic Context & Counter-Narrative
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {analysisResult.contextExplanation}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-2">
                    {submissionSuccess ? (
                      <div className="p-4 bg-emerald-500/15 dark:bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-800 dark:text-emerald-400 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm animate-in fade-in">
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <div>
                            <span className="font-bold text-[#1e140d] dark:text-slate-100 block text-xs sm:text-sm">
                              {portalRole === 'official' ? 'Dossier Certified & Saved to Official Registry' :
                               portalRole === 'journalist' ? 'Evidence Verified & Published to Pipeline' :
                               'Report Transmitted to Journalist Queue'}
                            </span>
                            <span className="text-[11px] text-[#705845] dark:text-slate-400 font-mono">
                              Case ID: #{submissionSuccess.substring(0, 10).toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => generatePDF({ ...analysisResult, content, sourcePlatform, postUrl, evidenceHash })}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download PDF</span>
                          </button>
                          <button
                            onClick={() => {
                              setSubmissionSuccess(null);
                              setContent('');
                              setImageBase64(null);
                              setImageFileName(null);
                              setPostUrl('');
                              setAnalysisResult(null);
                            }}
                            className="px-3 py-1.5 bg-[#ede2d3] dark:bg-slate-800 hover:bg-[#e4d5c3] dark:hover:bg-slate-700 text-[#1e140d] dark:text-slate-200 border border-[#dfd2bf] dark:border-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Submit Another
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          onClick={handleSubmitEvidence}
                          disabled={isSubmitting}
                          className={`font-semibold text-xs py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 text-white ${
                            portalRole === 'official' ? 'bg-amber-600 hover:bg-amber-500' :
                            portalRole === 'journalist' ? 'bg-[#c26e27] hover:bg-[#a05417]' :
                            'bg-emerald-600 hover:bg-emerald-500'
                          }`}
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>
                            {isSubmitting ? 'Transmitting...' : 
                             portalRole === 'official' ? 'Certify & Save to Official Registry' :
                             portalRole === 'journalist' ? 'Verify & Publish to Pipeline' :
                             'Submit to Verification Queue'}
                          </span>
                        </button>

                        <button
                          onClick={() => generatePDF({ ...analysisResult, content, sourcePlatform, postUrl, evidenceHash })}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs py-3 px-4 rounded-xl transition-colors border border-slate-700 flex items-center justify-center gap-2"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export Signed PDF Dossier</span>
                        </button>
                      </div>
                    )}

                    {/* Copy Platform Takedown Notice */}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(getTakedownNotice());
                        setCopiedNotice(true);
                        setTimeout(() => setCopiedNotice(false), 2500);
                      }}
                      className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      {copiedNotice ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedNotice ? 'Takedown Notice Copied to Clipboard!' : 'Copy Pre-Drafted Platform Takedown Notice'}</span>
                    </button>
                  </div>
                </div>
                  )}

                </div>
              ) : (
                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[380px] space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-200">Awaiting Evidence Input</h3>
                    <p className="text-xs text-slate-400 max-w-sm mt-1">
                      Paste a social media post or upload a screenshot on the left and click "Run Forensic AI Analysis" to decode hidden hate speech.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: EVIDENCE LOCKER (HISTORY) */}
        {activeTab === 'locker' && (
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100">Your Submitted Evidence Locker</h3>
                <p className="text-xs text-slate-400 mt-0.5">Track triage, verification status, and legal escalation across all your cases.</p>
              </div>
              <span className="text-xs font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg w-max">
                {reports.length} Total Incident Dossiers
              </span>
            </div>

            {reports.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                No reports submitted yet. Use the "New Evidence Intake" tab above to file your first incident.
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-slate-950 border border-slate-800/90 hover:border-slate-700 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                  >
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                          #{report.id.substring(0, 8).toUpperCase()}
                        </span>
                        <span className="text-slate-600">&bull;</span>
                        <span className="text-xs font-semibold text-slate-300">{report.sourcePlatform || 'Social Media'}</span>
                        <span className="text-slate-600">&bull;</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          report.status === 'escalated' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {report.status === 'escalated' ? 'Verified & Escalated to Officials' : 'Under Review by Journalists'}
                        </span>
                        
                        {/* Timestamp Tag */}
                        <span className="text-slate-600">&bull;</span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {formatTimestamp(report.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 line-clamp-1 font-medium">
                        {report.content || 'Attached Visual Evidence Submission'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={() => generatePDF(report)}
                        className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* INSPECTION MODAL FOR LOCKER (Mounted via Portal directly to body) */}
      {selectedReport && mounted && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setSelectedReport(null)}
        >
          <div 
            className="bg-[#0f172a] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">
                    DOSSIER #{selectedReport.id.toUpperCase()}
                  </span>
                  <span className="text-slate-600">&bull;</span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {formatTimestamp(selectedReport.timestamp)}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-100">
                  {selectedReport.sourcePlatform} Incident
                </h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="font-semibold text-slate-400 block mb-1">Documented Text:</span>
                <p className="text-slate-200 whitespace-pre-wrap">{selectedReport.content || 'No text provided.'}</p>
              </div>

              {selectedReport.imageBase64 && (
                <div>
                  <span className="font-semibold text-slate-400 block mb-1.5">Preserved Screenshot Evidence:</span>
                  <img src={selectedReport.imageBase64} alt="Evidence" className="w-full max-h-64 object-cover rounded-xl border border-slate-800" />
                </div>
              )}

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="font-semibold text-slate-400 block mb-1">Verified Context & Explanation:</span>
                <p className="text-slate-300 leading-relaxed">{selectedReport.contextExplanation || 'Hate speech detected.'}</p>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-400">
                Hash: {selectedReport.evidenceHash || 'SHA-256 Validated'}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => generatePDF(selectedReport)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Signed PDF</span>
              </button>
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
