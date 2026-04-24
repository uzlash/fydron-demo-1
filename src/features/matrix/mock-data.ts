import { delay } from "@/utils/helpers";
import type {
  MatrixActivityItem,
  MatrixChapterProgress,
  MatrixDossierAuditMode,
  MatrixDossierData,
  MatrixDossierMeta,
  MatrixDossierMode,
  MatrixDossierRow,
  MatrixPortfolioData,
  MatrixPortfolioMode,
} from "@/features/matrix/types";

const portfolioRows: MatrixPortfolioData["rows"] = [
  { id: "p1", organization: "Acme Corporation", framework: "ISO 27001", role: "Admin", progress: 82 },
  { id: "p2", organization: "Stark Industries", framework: "VCA 201", role: "Auditor", progress: 82 },
  { id: "p3", organization: "Wayne Enterprises", framework: "ISO 27001", role: "Contributor", progress: 82 },
  { id: "p4", organization: "Google", framework: "VCA 201", role: "Reviewer", progress: 82 },
  { id: "p5", organization: "Facebook", framework: "ISO 27001", role: "Reviewer", progress: 82 },
  { id: "p6", organization: "Acme Corporation", framework: "ISO 4500", role: "Auditor", progress: 82 },
  { id: "p7", organization: "Acme Corporation", framework: "ISO 4500", role: "Admin", progress: 82 },
  { id: "p8", organization: "Wayne Enterprises", framework: "VCA 201", role: "Auditor", progress: 82 },
  { id: "p9", organization: "Beta Solutions", framework: "ISO 4500", role: "Reviewer", progress: 82 },
  { id: "p10", organization: "Acme Corporation", framework: "VCA 201", role: "User", progress: 82 },
  { id: "p11", organization: "Wayne Enterprises", framework: "ISO 27001", role: "Admin", progress: 82 },
  { id: "p12", organization: "Beta Solutions", framework: "VCA", role: "Auditor", progress: 82 },
  { id: "p13", organization: "Beta Solutions", framework: "VCA", role: "Reviewer", progress: 82 },
  { id: "p14", organization: "Beta Solutions", framework: "VCA", role: "User", progress: 82 },
  { id: "p15", organization: "Wayne Enterprises", framework: "ISO 4500", role: "Admin", progress: 82 },
  { id: "p16", organization: "Google", framework: "ISO 4500", role: "Auditor", progress: 82 },
  { id: "p17", organization: "Google", framework: "ISO 4500", role: "Reviewer", progress: 82 },
];

const dossierData: MatrixDossierData = {
  meta: {
    id: "ISO 27001",
    frameworkVersion: "2022",
    overallCompliance: 0,
    lastSynced: "0 hours ago",
    organizationName: "Medical Center X",
  },
  rows: [
    { id: "d1", title: "1.1 Data Privacy Guidelines", status: "reviewed", requirementId: "B7.3", lastUpdated: "10 mins ago" },
    { id: "d2", title: "1.2 User Access Control", status: "notApproved", requirementId: "C2.9", lastUpdated: "20 mins ago" },
    { id: "d3", title: "1.3 Incident Response Plan", status: "awaitingReview", requirementId: "R4.6", lastUpdated: "30 mins ago" },
    { id: "d4", title: "1.4 Network Security Standards", status: "approved", requirementId: "E1.2", lastUpdated: "45 mins ago" },
    { id: "d5", title: "1.5 Encryption Requirements", status: "proofNeeded", requirementId: "Y9.8", lastUpdated: "50 mins ago" },
    { id: "d6", title: "1.6 Password Management Polic", status: "awaitingReview", requirementId: "A3.7", lastUpdated: "Less than a minute ago" },
    { id: "d7", title: "1.7 Remote Access Procedures", status: "notApproved", requirementId: "C6.5", lastUpdated: "1 hour 15 mins ago" },
    { id: "d8", title: "1.8 Vendor Security Assessment", status: "proofNeeded", requirementId: "K0.4", lastUpdated: "1 hour 30 mins ago" },
    { id: "d9", title: "1.8 Data Backup Policy", status: "approved", requirementId: "A8.1", lastUpdated: "2 hours ago" },
    { id: "d10", title: "1.9 Mobile Device Management", status: "notApproved", requirementId: "B2.0", lastUpdated: "2 hours 10 mins ago" },
    { id: "d11", title: "2.0 Physical Security Controls", status: "proofNeeded", requirementId: "A5.9", lastUpdated: "---------------" },
    { id: "d12", title: "2.1 Cloud Security Framework", status: "awaitingReview", requirementId: "A7.3", lastUpdated: "3 hours ago" },
    { id: "d13", title: "2.2 Security Awareness Training", status: "proofNeeded", requirementId: "V9.6", lastUpdated: "3 hours 20 mins ago" },
    { id: "d14", title: "2.3 Audit and Compliance", status: "awaitingReview", requirementId: "E4.8", lastUpdated: "3 hours 45 mins ago" },
    { id: "d15", title: "2.3 Data Retention Policy", status: "approved", requirementId: "A1.3", lastUpdated: "4 hours ago" },
    { id: "d16", title: "2.4 Malware Protection Guidelin", status: "notApproved", requirementId: "A6.7", lastUpdated: "15-03-2026 15:08" },
  ],
};

/** Shared sample rows for Client Portfolio “turbo” dossier view (same structure as matrix dossier). */
export const matrixDossierReferenceRows: MatrixDossierRow[] = dossierData.rows;
export const matrixDossierReferenceMeta: MatrixDossierMeta = dossierData.meta;

const activityItems: MatrixActivityItem[] = [
  { id: "a1", day: "Today", title: "System Sync Completed", detail: "All Indicators updated Successfully", time: "11:09 AM", tab: "sync", tone: "success" },
  { id: "a2", day: "Today", title: "Bulk Upload by Admin", detail: "12 files added to \"financial Compliance\"", time: "09:42 AM", tab: "uploads", tone: "info" },
  { id: "a3", day: "Today", title: "Status Updated", detail: "Indicator - Needs Review", time: "07:20 AM", tab: "all", tone: "danger" },
  { id: "a4", day: "Yesterday", title: "System scan started", detail: "All systems are nominal", time: "11:09 AM", tab: "sync", tone: "success" },
  { id: "a5", day: "Yesterday", title: "Admin uploaded new policy", detail: "12 files added to \"HR Onboarding\"", time: "09:42 AM", tab: "uploads", tone: "info" },
  { id: "a6", day: "Yesterday", title: "Bulk Upload by Admin", detail: "12 files added to \"financial Compliance\"", time: "09:42 AM", tab: "uploads", tone: "info" },
  { id: "a7", day: "Yesterday", title: "Access Granted", detail: "Alert - High Risk Activity", time: "07:20 AM", tab: "all", tone: "danger" },
  { id: "a8", day: "Yesterday", title: "Access Granted", detail: "Alert - High Risk Activity", time: "07:20 AM", tab: "all", tone: "danger" },
];

const complianceChapters: MatrixChapterProgress[] = [
  { id: "c1", label: "Chapter 1: *****", percent: 72 },
  { id: "c2", label: "Chapter 2: *****", percent: 50 },
  { id: "c3", label: "Chapter 3: *****", percent: 100 },
  { id: "c4", label: "Chapter 4: *****", percent: 30 },
  { id: "c5", label: "Chapter 5: *****", percent: 100 },
  { id: "c6", label: "Chapter 6: *****", percent: 30 },
  { id: "c7", label: "Chapter 7: *****", percent: 100 },
  { id: "c8", label: "Chapter 8: *****", percent: 30 },
  { id: "c9", label: "Chapter 9: *****", percent: 100 },
  { id: "c10", label: "Chapter 10: *****", percent: 30 },
];

export async function fetchMatrixPortfolioData(mode: MatrixPortfolioMode): Promise<MatrixPortfolioData> {
  await delay(500);
  if (mode === "empty") {
    return { rows: [] };
  }
  return { rows: portfolioRows };
}

export async function fetchMatrixDossierData(mode: MatrixDossierMode, auditMode: MatrixDossierAuditMode = "standard"): Promise<MatrixDossierData> {
  await delay(mode === "loading" ? 1300 : 420);
  if (mode === "empty") {
    return { ...dossierData, rows: [] };
  }
  if (auditMode === "underReview") {
    return {
      meta: {
        ...dossierData.meta,
        overallCompliance: 100,
        lastSynced: "3 hours ago",
      },
      rows: dossierData.rows.map((row) => ({ ...row, status: "approved" as const })),
    };
  }
  return dossierData;
}

export async function fetchMatrixActivityItems(): Promise<MatrixActivityItem[]> {
  await delay(250);
  return activityItems;
}

export async function fetchMatrixComplianceChapters(): Promise<MatrixChapterProgress[]> {
  await delay(250);
  return complianceChapters;
}
