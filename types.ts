export interface PlatformSpec {
  id: string;
  name: string;
  width: number;
  height: number;
  ratioLabel: string; // e.g., "1.45:1"
  description: string;
  geminiAspectRatio: string; // Closest match: "1:1", "3:4", "4:3", "9:16", "16:9"
}

export interface GenerationResult {
  analysis: string;
  imageUrl?: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  GENERATING = 'GENERATING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}
