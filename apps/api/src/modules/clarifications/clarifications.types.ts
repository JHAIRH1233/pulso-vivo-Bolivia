export type ClarificationStatus = 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED';

export interface CreateClarificationInput {
  title: string;
  content: string;
  clusterId?: string;
  communiqueId?: string;
}

export interface UpdateClarificationInput {
  title?: string;
  content?: string;
}
