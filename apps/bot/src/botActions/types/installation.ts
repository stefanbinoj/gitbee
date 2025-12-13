export type TargetType = "User" | "Organization" | "Bot";

export type SenderType = "User" | "Organization" | "Bot";

export type RepositoryVisibility = "public" | "private";

export type RepositorySelection = "all" | "selected";

export type ReportType =
  | "ingestion"
  | "comment_analysis"
  | "pr_analysis"
  | "issue_analysis";

export type ReportStatus = "in_progress" | "completed" | "failed";

export type WarningType = "warning" | "block";

export interface WebhookRepository {
  id: number;
  full_name: string;
  private: boolean;
}

export interface InstallationData {
  installationId: number;
  targetType: TargetType;
  targetId: number;
  targetLogin: string;
  repositorySelection: RepositorySelection;
  senderLogin?: string;
  senderId?: number;
  senderType?: SenderType;
}

export interface RepositoryData {
  targetId: number;
  repositoryId: number;
  repositoryFullName: string;
  repositoryVisibility: RepositoryVisibility;
}

export interface IngestionOptions {
  owner: string;
  repo: string;
}
