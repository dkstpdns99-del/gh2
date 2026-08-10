export type AnchorCode = 'TF' | 'GM' | 'AU' | 'SE' | 'EC' | 'SV' | 'CH' | 'LS';

export interface AnchorInfo {
  code: AnchorCode;
  title: string; // e.g., 전문가형
  englishTitle: string; // e.g., TECHNICAL/FUNCTIONAL
  subtitle: string;
  color: string; // Hex color code
  bgLight: string; // TailWind or CSS bg color
  description: string;
  longDescription: string;
  coreValues: string[];
  idealEnvironments: string[];
  recommendedCareers: string[];
}

export interface Question {
  id: number;
  anchorCode: AnchorCode;
  text: string;
}

export type Responses = Record<number, number>; // questionId -> rating (1..4)

export type AnchorScores = Record<AnchorCode, number>; // raw or scaled score (0..100)

export interface AssessmentResult {
  scores: AnchorScores;
  rawScores: Record<AnchorCode, number>;
  topAnchor: {
    code: AnchorCode;
    title: string;
    englishTitle: string;
    score: number;
  };
  secondaryAnchors: Array<{
    code: AnchorCode;
    title: string;
    englishTitle: string;
    score: number;
  }>;
  completedAt: string;
}

export interface AIInsightData {
  summary: string;
  preferredEnvironments?: string[];
  avoidEnvironments?: string[];
  careerTips?: string[];
}

export interface AIJobAnalysisData {
  jobTitle: string;
  matchPercentage: number;
  matchSummary: string;
  detailedAnalysis: string;
  strengthsInRole: string[];
  potentialRisks?: string[];
  advice: string;
}
