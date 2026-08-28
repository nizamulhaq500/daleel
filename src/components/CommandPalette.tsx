'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  ShieldAlert, 
  FileText, 
  Building, 
  Layers, 
  Send, 
  BookOpen, 
  Compass, 
  ArrowRight, 
  Hash, 
  Sparkles,
  X,
  Flame,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, limit, getDocs } from 'firebase/firestore';

interface SearchItem {
  id: string;
  category: 'Navigation' | 'Actions' | 'Coded Slur Lexicon' | 'Recent Reports';
  title: string;
  subtitle?: string;
  icon: any;
  action: () => void;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [queryText, setQueryText] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);

      // Fetch recent reports for instant search
      const fetchReports = async () => {
        try {
          const q = query(collection(db, 'reports'), limit(8));
          const snapshot = await getDocs(q);
          const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setRecentReports(docs);
        } catch (e) {
          console.warn('Could not fetch reports for command palette', e);
        }
      };
      fetchReports();
    } else {
      document.body.style.overflow = 'unset';
      setQueryText('');
      setSelectedIndex(0);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const defaultItems: SearchItem[] = [
    // Navigation
    {
      id: 'nav-home',
      category: 'Navigation',
      title: 'Home & Fact-Check Studio',
      subtitle: 'Main public verification terminal and search',
      icon: Compass,
      action: () => { router.push('/'); setIsOpen(false); }
    },
    {
      id: 'nav-reporter',
      category: 'Navigation',
      title: 'Community Reporter Workspace',
      subtitle: 'Incident intake, SHA-256 hash preservation, and evidence locker',
      icon: Send,
      action: () => { router.push('/dashboard/reporter'); setIsOpen(false); }
    },
    {
      id: 'nav-journalist',
      category: 'Navigation',
      title: 'Journalist & Newsroom Triage Hub',
      subtitle: 'Review community submissions, add editorial notes, and export briefs',
      icon: Layers,
      action: () => { router.push('/dashboard/journalist'); setIsOpen(false); }
    },
    {
      id: 'nav-official',
      category: 'Navigation',
      title: 'Official & Legal Authority Console',
      subtitle: 'Statutory compliance tracking and legal takedown demands',
      icon: Building,
      action: () => { router.push('/dashboard/official'); setIsOpen(false); }
    },
    // Quick Actions
    {
      id: 'action-report',
      category: 'Actions',
      title: 'Submit New Incident Evidence',
      subtitle: 'Open direct forensic intake with screenshot upload',
      icon: ShieldAlert,
      action: () => { router.push('/dashboard/reporter'); setIsOpen(false); }
    },
    {
      id: 'action-factcheck',
      category: 'Actions',
      title: 'Run AI Fact-Check Query',
      subtitle: 'Verify anti-Muslim disinformation claims against academic databases',
      icon: Sparkles,
      action: () => { 
        router.push('/#factcheck-studio');
        setIsOpen(false);
      }
    },
    // Slurs & Tropes Lexicon
    {
      id: 'slur-halal',
      category: 'Coded Slur Lexicon',
      title: 'Halal Certification Tax / Economic Jihad',
      subtitle: 'False claim that halal fees fund terrorism. Reality: Standard compliance verification.',
      icon: Hash,
      action: () => { router.push('/#narratives'); setIsOpen(false); }
    },
    {
      id: 'slur-sharia',
      category: 'Coded Slur Lexicon',
      title: 'Creeping Sharia / Dual Legal System',
      subtitle: 'Conspiracy alleging Islamic takeover of secular courts. Debunked by legal scholars.',
      icon: Hash,
      action: () => { router.push('/#narratives'); setIsOpen(false); }
    },
    {
      id: 'slur-taqiyya',
      category: 'Coded Slur Lexicon',
      title: 'Taqiyya Misrepresentation',
      subtitle: 'Distorting theological self-defense doctrine to claim all Muslims are deceitful.',
      icon: Hash,
      action: () => { router.push('/#narratives'); setIsOpen(false); }
    },
    {
      id: 'slur-replacement',
      category: 'Coded Slur Lexicon',
      title: 'Demographic Replacement / Eurabia',
      subtitle: 'White supremacist conspiracy theory regarding population growth.',
      icon: Hash,
      action: () => { router.push('/#narratives'); setIsOpen(false); }
    }
  ];

  // Add recent reports dynamically
  const dynamicReportItems: SearchItem[] = recentReports.map((r) => ({
    id: `report-${r.id}`,
    category: 'Recent Reports',
    title: `Case #${r.id.substring(0, 8).toUpperCase()} (${r.sourcePlatform || 'Social'})`,
    subtitle: r.content ? r.content.substring(0, 75) + '...' : 'Preserved visual evidence dossier',
    icon: FileText,
    action: () => {
      router.push('/dashboard/journalist');
      setIsOpen(false);
    }
  }));

  const allItems = [...defaultItems, ...dynamicReportItems];

  const filteredItems = allItems.filter((item) => {
    const q = queryText.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleKeyDownInList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      e.preventDefault();
      filteredItems[selectedIndex].action();
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* Global Hotkey Trigger Button (Optional visible hint) */}
      <div className="hidden">
        <button onClick={() => setIsOpen(true)}>⌘K</button>
      </div>

      {isOpen && createPortal(
        <div 
          className="fixed inset-0 z-[999999] flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-100"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-[#0f172a] border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-100 flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDownInList}
          >
            {/* Search Input Bar */}
            <div className="relative border-b border-slate-800 p-4 flex items-center gap-3 bg-slate-950/60">
              <Search className="w-5 h-5 text-emerald-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={queryText}
                onChange={(e) => {
                  setQueryText(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command, case ID, slur, or jump to a portal..."
                className="w-full bg-transparent border-none text-slate-100 text-sm placeholder-slate-500 focus:outline-none"
              />
              {queryText && (
                <button
                  onClick={() => setQueryText('')}
                  className="text-slate-500 hover:text-slate-300 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-400 rounded">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="overflow-y-auto p-2 space-y-1 flex-1">
              {filteredItems.length === 0 ? (
                <div className="py-10 text-center text-slate-500 text-xs">
                  No matching commands, cases, or slurs found for "{queryText}".
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-emerald-600/15 border border-emerald-500/30 text-emerald-300' 
                          : 'text-slate-300 hover:bg-slate-900 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-lg ${
                          isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-900 text-slate-400'
                        }`}>
                          <Icon className="w-4 h-4 shrink-0" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-100 truncate block">
                              {item.title}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400 uppercase">
                              {item.category}
                            </span>
                          </div>
                          {item.subtitle && (
                            <p className="text-[11px] text-slate-400 truncate mt-0.5 max-w-lg">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      <ArrowRight className={`w-3.5 h-3.5 shrink-0 transition-opacity ${
                        isSelected ? 'opacity-100 text-emerald-400' : 'opacity-0'
                      }`} />
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Shortcuts */}
            <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span>Navigate: <kbd className="font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400">↑</kbd> <kbd className="font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400">↓</kbd></span>
                <span>Select: <kbd className="font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400">↵</kbd></span>
              </div>
              <span className="text-slate-400">Daleel Intelligence Desk</span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
