export interface LogDocument {
  correlationId?: string;
  message?: string;
  status?: string;
  source?: string;
  createdAt?: string;
  result?: string;
  completedAt?: string;
}
