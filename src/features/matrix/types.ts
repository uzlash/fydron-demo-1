export type MatrixRole = "Admin" | "Auditor" | "Contributor" | "Reviewer" | "User";

export type MatrixPortfolioRow = {
  id: string;
  organization: string;
  framework: string;
  role: MatrixRole;
  progress: number;
};

export type MatrixPortfolioData = {
  rows: MatrixPortfolioRow[];
};

export type MatrixPortfolioMode = "full" | "empty";

export type MatrixStatus = "reviewed" | "approved" | "awaitingReview" | "notApproved" | "proofNeeded";

export type MatrixDossierRow = {
  id: string;
  title: string;
  status: MatrixStatus;
  requirementId: string;
  lastUpdated: string;
};

export type MatrixDossierMeta = {
  id: string;
  frameworkVersion: string;
  overallCompliance: number;
  lastSynced: string;
  organizationName: string;
};

export type MatrixDossierData = {
  meta: MatrixDossierMeta;
  rows: MatrixDossierRow[];
};

export type MatrixDossierMode = "loading" | "empty" | "full";

/** Demo workflow states for dossier read-only / audit UI (not persisted). */
export type MatrixDossierAuditMode = "standard" | "inspection" | "underReview";

export type MatrixActivityTab = "all" | "sync" | "uploads";

export type MatrixActivityItem = {
  id: string;
  day: string;
  title: string;
  detail: string;
  time: string;
  tab: MatrixActivityTab;
  tone: "success" | "info" | "danger";
};

export type MatrixChapterProgress = {
  id: string;
  label: string;
  percent: number;
};

/** How "Activate Team" is seeded when opening the dossier after workflow activation (`?activation=`). */
export type MatrixAddTeamActivationPreset = "default" | "standard" | "direct";

/** Query param and dossier id used when opening Matrix after successful activation. */
export const MATRIX_ACTIVATION_QUERY_KEY = "activation" as const;
export const MATRIX_ACTIVATION_DOSSIER_ID = "iso-27001-mcx" as const;
