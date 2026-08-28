'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { 
  Compass, 
  ShieldAlert, 
  FileText, 
  Building, 
  Layers, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  X, 
  Lock, 
  Sparkles,
  Scale
} from 'lucide-react';
import { BsOctagonHalf } from 'react-icons/bs';

interface TourStep {
  step: number;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  details: string[];
  icon: any;
  actionText: string;
  actionRoute: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    step: 1,
    title: 'Evidence Preservation & Cryptographic Stamping',
    badge: 'Phase 1: Community Reporter',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    description: 'When anti-Muslim hate speech or disinformation appears on social media, bad actors frequently delete posts after inciting violence. Daleel creates an immutable digital chain of custody.',
    details: [
      'Captures visual screenshots and post URLs without reliance on third-party links',
      'Generates browser-side SHA-256 cryptographic fingerprints to prove zero post-capture tampering',
      'Stores evidence in a secure, privacy-first evidence locker with exportable PDF certificates'
    ],
    icon: ShieldAlert,
    actionText: 'Explore Reporter Workspace',
    actionRoute: '/dashboard/reporter'
  },
  {
    step: 2,
    title: 'Newsroom Triage & Coded Slur Deconstruction',
    badge: 'Phase 2: Journalist & Fact-Checker',
    badgeColor: 'bg-[#c26e27]/10 text-[#c26e27] border-[#c26e27]/20',
    description: 'Modern Islamophobia rarely uses blunt language; it relies on dog-whistles, historical revisionism, and pseudo-economic conspiracies engineered to evade automated AI filters.',
    details: [
      'Deconstructs coded tropes using peer-reviewed research (Georgetown Bridge Initiative & Tell MAMA)',
      'Editorial peer review: Journalists attach factual verification notes and certified newsroom stamps',
      'One-click multi-format syndication for Substack, broadcast teleprompter, and social threads'
    ],
    icon: Layers,
    actionText: 'Explore Journalist Triage Hub',
    actionRoute: '/dashboard/journalist'
  },
  {
    step: 3,
    title: 'Statutory Legal Action & Platform Accountability',
    badge: 'Phase 3: Official Authority Desk',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    description: 'Verified incident dossiers are escalated directly to public agencies, civil rights litigators, and platform Trust & Safety compliance divisions.',
    details: [
      'Automated statutory notices citing EU Digital Services Act Art. 16 and UK Online Safety Act',
      'Court-ready JSON discovery packages containing raw metadata and cryptographic signatures',
      'Platform Compliance Scorecards auditing response latency and takedown success rates'
    ],
    icon: Scale,
    actionText: 'Explore Official Command',
    actionRoute: '/dashboard/official'
  }
];

export default function OnboardingTour({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

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

  const currentStep = TOUR_STEPS[currentStepIndex];
  const Icon = currentStep.icon;

  return createPortal(
    <div 
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-[#ffffff] dark:bg-[#0f172a] border border-[#dfd2bf] dark:border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header & Step Indicator */}
        <div className="flex items-center justify-between pb-4 border-b border-[#dfd2bf] dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded border ${currentStep.badgeColor}`}>
              {currentStep.badge}
            </span>
            <span className="text-xs text-[#705845] dark:text-slate-400 font-medium">&bull; Step {currentStepIndex + 1} of 3</span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 dark:hover:text-white p-1 rounded-lg hover:bg-[#f5ebe0] dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Body */}
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#ede2d3] dark:bg-slate-900 border border-[#dfd2bf] dark:border-slate-800 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1">
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#1e140d] dark:text-slate-100 leading-snug">
                {currentStep.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#382619] dark:text-slate-300 mt-1.5 leading-relaxed font-medium">
                {currentStep.description}
              </p>
            </div>
          </div>

          {/* Details List */}
          <div className="bg-[#fdfaf5] dark:bg-slate-950 p-4 rounded-2xl border border-[#dfd2bf] dark:border-slate-800 space-y-2.5 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#705845] dark:text-slate-400 block">
              Core Technical Capabilities:
            </span>
            <ul className="space-y-2 text-xs text-[#382619] dark:text-slate-300 font-medium">
              {currentStep.details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Navigation & Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#dfd2bf] dark:border-slate-800">
          
          {/* Progress Dots */}
          <div className="flex items-center gap-2">
            {TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIndex ? 'w-8 bg-emerald-500' : 'bg-[#dfd2bf] dark:bg-slate-700 hover:bg-[#cfc1b0] dark:hover:bg-slate-600'
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {currentStepIndex > 0 && (
              <button
                onClick={() => setCurrentStepIndex((prev) => prev - 1)}
                className="px-3.5 py-2 bg-[#ede2d3] hover:bg-[#e4d5c3] dark:bg-slate-900 dark:hover:bg-slate-800 border border-[#dfd2bf] dark:border-slate-800 text-[#1e140d] dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            )}

            {currentStepIndex < TOUR_STEPS.length - 1 ? (
              <button
                onClick={() => setCurrentStepIndex((prev) => prev + 1)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <span>Next Feature</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  router.push(currentStep.actionRoute);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <span>{currentStep.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

      </div>
    </div>,
    document.body
  );
}
