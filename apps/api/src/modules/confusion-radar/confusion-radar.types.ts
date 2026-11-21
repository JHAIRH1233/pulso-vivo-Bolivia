export interface ConfusionRadarCluster {
  id: string;
  communiqueId: string | null;
  title: string;
  summary: string;
  questionCount: number;
  status: 'ACTIVE' | 'RESOLVED';
  updatedAt: Date;
}

export interface AnalyzeConfusionResult {
  analyzedQuestionCount: number;
  clusters: ConfusionRadarCluster[];
}
