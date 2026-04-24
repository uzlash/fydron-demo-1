export type DashboardRole =
  | "Admin"
  | "Uploader"
  | "Contributor"
  | "Reviewer"
  | "Auditor";

export type DashboardStatKey =
  | "activeDossiers"
  | "unreadMessages"
  | "upcomingDeadlines";

export type DashboardStat = {
  key: DashboardStatKey;
  value: number;
};

export type DossierRow = {
  id: string;
  organization: string;
  dossier: string;
  role: DashboardRole;
  progress: number;
};

export type DashboardData = {
  greetingName: string;
  stats: DashboardStat[];
  dossiers: DossierRow[];
};

export type DashboardDataMode = "full" | "empty";

export type NotificationTab = "all" | "unread" | "mentions";

export type NotificationItem = {
  id: string;
  title: string;
  actor: string;
  time: string;
  relativeTime: string;
  dayLabel: string;
  unread: boolean;
  hasMention: boolean;
  actionLabel: string;
};