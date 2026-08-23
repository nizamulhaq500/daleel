export enum HateCategory {
  EXPLICIT = 'explicit',
  CODED = 'coded',
  VISUAL = 'visual',
  RELATIONAL = 'relational',
  SYNTHETIC = 'synthetic',
}

export enum SeverityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface CodedTerm {
  term: string;
  meaning: string;
  context: string;
  severity: SeverityLevel;
  category: 'dog_whistles' | 'coded_slurs' | 'conspiracy_terms' | 'dehumanization' | 'political_coded';
}

export interface PlatformPolicy {
  platform: string;
  reportingUrl: string;
  policySummary: string;
  relevantCategories: string[];
  reportingInstructions: string[];
  evidenceToInclude: string[];
  expectedResponseTime: string;
  escalationOptions: string[];
}

export interface ToxicityScores {
  toxicity: number;
  severeToxicity: number;
  identityAttack: number;
  insult: number;
  threat: number;
}

export interface AnalysisResult {
  categories: HateCategory[];
  detectedTerms: string[];
  contextExplanation: string;
  counterNarratives: string[];
  violatedPolicies: string[];
  severityScore: number;
  toxicityScores?: ToxicityScores;
  mocked?: boolean;
}

export interface EvidenceReport {
  id: string;
  timestamp: string;
  content: string;
  contentType: 'text' | 'url' | 'image';
  sourceUrl?: string;
  analysis: AnalysisResult;
}
