export const TURBO_DOSSIER_EVIDENCE_FILE_ROWS: { id: string; label: string; meta: string }[] = [
  { id: "1", label: "Incident Response", meta: "PDF • sample" },
  { id: "2", label: "Escalation Logs", meta: "DOCX • sample" },
  { id: "3", label: "Review Meeting Minutes", meta: "PDF • sample" },
  { id: "4", label: "Past Incident Reports", meta: "PDF • sample" },
];

export const TURBO_DOSSIER_REQUIRED_ELEMENT_LINES = [
  "Defined incident categories",
  "Assigned incident response roles",
  "Escalation matrix",
  "Documentation procedures",
  "Post-incident review process",
] as const;

/** Dossier drawer & Auditor Turbo-View use the same control requirement title per row. */
export function getTurboDossierReviewerTitle(rowId: string): string {
  if (rowId === "d1") return "5.1.1 - Management Commitment";
  if (rowId === "d2") return "A.5.1 - Information Security Policies";
  return "5.1.1 - Management Commitment";
}
