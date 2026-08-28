'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  BookOpen, 
  Search, 
  Hash, 
  Copy, 
  Check, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Filter,
  ExternalLink
} from 'lucide-react';

interface LexiconEntry {
  term: string;
  category: 'Coded Slurs' | 'Disinformation Tropes' | 'Historical Revisionism' | 'Dehumanizing Memes';
  severity: 'Critical' | 'High' | 'Elevated';
  bypassTactic: string;
  meaning: string;
  factualRefutation: string;
  academicCitation: string;
}

const LEXICON_DATABASE: LexiconEntry[] = [
  {
    term: 'Halal Certification Tax / Economic Jihad',
    category: 'Disinformation Tropes',
    severity: 'High',
    bypassTactic: 'Frames commercial compliance testing as subversive stealth taxation to trigger boycott movements.',
    meaning: 'False claim that routine certification fees paid by food manufacturers to verify halal dietary standards are diverted to sponsor terrorism.',
    factualRefutation: 'Halal certification is a voluntary commercial audit standard identical to Kosher, Vegan, and Organic certifications. Fees cover inspector auditing; zero revenue is transferred to illegal militancy.',
    academicCitation: 'The Bridge Initiative @ Georgetown University; Australian Senate Economics References Committee'
  },
  {
    term: 'Remove Kebab / Kebab Meme',
    category: 'Historical Revisionism',
    severity: 'Critical',
    bypassTactic: 'Uses culinary memes to obscure explicit glorification of the 1995 Srebrenica genocide.',
    meaning: 'A white supremacist meme referencing Serbian military propaganda and the ethnic cleansing of Bosnian Muslims.',
    factualRefutation: 'Documented by the UN International Criminal Tribunal for the former Yugoslavia (ICTY) and hate crime monitors as explicit genocide glorification.',
    academicCitation: 'United Nations ICTY Archive & Tell MAMA Hate Crime Lexicon'
  },
  {
    term: 'Taqiyya / Stealth Jihadist',
    category: 'Coded Slurs',
    severity: 'High',
    bypassTactic: 'Distorts a classical theological self-defense concept to argue that all public statements by Muslims are deceitful.',
    meaning: 'Accusing Muslim civic participants, doctors, or politicians of concealing a clandestine takeover plan under the guise of civic loyalty.',
    factualRefutation: 'In classical jurisprudence, Taqiyya applies strictly as a permission for persecuted religious minorities facing imminent death to conceal their faith, not as a blanket mandate for civic deceit.',
    academicCitation: 'Oxford Encyclopedia of Islamic Law; ISPU Civic Engagement Survey'
  },
  {
    term: 'Demographic Replacement / Eurabia',
    category: 'Disinformation Tropes',
    severity: 'Critical',
    bypassTactic: 'Employs pseudo-demographic extrapolations to justify anti-immigrant violence and mass deportations.',
    meaning: 'Conspiracy alleging that Muslim birth rates are orchestrated by globalist elites to replace Western indigenous populations.',
    factualRefutation: 'Pew Research demographic projections confirm fertility rates among Muslim immigrants rapidly converge to local national averages within one generation.',
    academicCitation: 'Pew Research Center Demographics; Institute for Strategic Dialogue (ISD)'
  },
  {
    term: 'Stealth Sharia / Creeping Sharia',
    category: 'Disinformation Tropes',
    severity: 'Elevated',
    bypassTactic: 'Conflates standard private civil mediation with state constitutional usurpation.',
    meaning: 'Claiming that voluntary community arbitration panels (e.g. halal estate division or divorce mediation) are replacing national courts.',
    factualRefutation: 'Voluntary religious mediation operates strictly under secular statutory frameworks (e.g. UK Arbitration Act 1996) with zero criminal jurisdiction and full subordination to constitutional law.',
    academicCitation: 'American Bar Association (ABA) Special Committee on Foreign Law Bans'
  },
  {
    term: 'Two-Tier Policing / Preferential Treatment',
    category: 'Disinformation Tropes',
    severity: 'High',
    bypassTactic: 'Alleges institutional bias favoring minority communities to incite civil disobedience and street protests.',
    meaning: 'A conspiracy asserting police forces protect minority demonstrators while brutally repressing majority populations.',
    factualRefutation: 'Independent police inspection reports (HMICFRS) confirm strict operational neutrality across all public demonstrations regardless of community background.',
    academicCitation: 'His Majesty’s Inspectorate of Constabulary and Fire & Rescue Services (HMICFRS)'
  }
];

export default function SlurLexiconModal({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

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

  const categories = ['All', 'Coded Slurs', 'Disinformation Tropes', 'Historical Revisionism'];

  const filteredEntries = LEXICON_DATABASE.filter((entry) => {
    const matchesCat = selectedCategory === 'All' || entry.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      entry.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
      entry.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.factualRefutation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return createPortal(
    <div 
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-[#0f172a] border border-slate-700 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#c26e27]/10 text-[#c26e27] border border-[#c26e27]/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">
                Academic Coded Slur & Disinformation Lexicon
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Peer-reviewed dictionary of dog-whistles, bypass tactics, and factual refutations.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lexicon by dog-whistle, meaning, or fact check..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#c26e27]"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs shrink-0 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat ? 'bg-[#c26e27] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Lexicon Cards */}
        <div className="space-y-4">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No entries found matching your search.
            </div>
          ) : (
            filteredEntries.map((entry, idx) => (
              <div 
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3.5 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-bold text-slate-100">
                      "{entry.term}"
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      entry.severity === 'Critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      entry.severity === 'High' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-[#c26e27]/10 text-[#c26e27] border border-[#c26e27]/20'
                    }`}>
                      {entry.severity} Threat
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {entry.category}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`Coded Slur Finding: "${entry.term}"\nMeaning: ${entry.meaning}\nFactual Refutation: ${entry.factualRefutation}\nAcademic Citation: ${entry.academicCitation}`);
                      setCopiedIndex(idx);
                      setTimeout(() => setCopiedIndex(null), 2000);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 transition-colors w-max"
                  >
                    {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedIndex === idx ? 'Copied Citation' : 'Copy Citation'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#fdf0f0] dark:bg-rose-950/20 p-3.5 rounded-xl border border-[#f8c9c9] dark:border-rose-900/40 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#a12323] dark:text-rose-400 block">Deconstructive Meaning:</span>
                    <p className="text-[#2e1f14] dark:text-slate-300 leading-relaxed font-medium">{entry.meaning}</p>
                  </div>

                  <div className="bg-[#eaf2ed] dark:bg-emerald-950/20 p-3.5 rounded-xl border border-[#cce0d4] dark:border-emerald-900/40 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#13633d] dark:text-emerald-400 block">Factual & Legal Reality:</span>
                    <p className="text-[#1b2d23] dark:text-slate-300 leading-relaxed font-medium">{entry.factualRefutation}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-900">
                  <span>Bypass Tactic: <strong className="text-slate-400">{entry.bypassTactic}</strong></span>
                  <span className="shrink-0 text-slate-400 font-medium">Source: {entry.academicCitation}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            Close Lexicon
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
