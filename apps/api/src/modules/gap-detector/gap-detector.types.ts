export interface GapFinding {
  topic: string;
  explanation: string;
  evidence: string | null;
  clarifyingQuestion: string;
}

export interface GapDetectorResult {
  missingInformation: GapFinding[];
  ambiguities: GapFinding[];
}
