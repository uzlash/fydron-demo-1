"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Button, Input, Textarea } from "@fluentui/react-components";
import {
  ArrowUpload16Regular,
  CheckmarkCircle16Filled,
  ChevronRight16Regular,
  Dismiss20Regular,
  Document20Regular,
  DocumentAdd20Regular,
  Eye16Regular,
  Person16Regular,
  QuestionCircle16Regular,
  Delete16Regular,
  Warning16Filled,
} from "@fluentui/react-icons";
import { DocumentPreviewModal } from "@/components/document-preview-modal";
import type { MatrixDossierAuditMode, MatrixDossierRow } from "@/features/matrix/types";
import { demoAttachmentKindForEvidenceId } from "@/lib/sample-documents";
import { useLocale } from "@/i18n/locale-context";

type MatrixReviewerPanelProps = {
  row: MatrixDossierRow;
  onClose: () => void;
  auditMode?: MatrixDossierAuditMode;
  /** Inline page layout (no drawer chrome; full-width document preview). */
  layout?: "drawer" | "inline";
};

const EVIDENCE_FILE_ROWS: { id: string; label: string; meta: string }[] = [
  { id: "1", label: "Incident Response", meta: "PDF • sample" },
  { id: "2", label: "Escalation Logs", meta: "DOCX • sample" },
  { id: "3", label: "Review Meeting Minutes", meta: "PDF • sample" },
  { id: "4", label: "Past Incident Reports", meta: "PDF • sample" },
];

function EvidenceUploadBlock({ children, blurred }: { children: ReactNode; blurred: boolean }) {
  return (
    <div className="relative mt-6">
      <div className={blurred ? "pointer-events-none select-none blur-[5px]" : ""}>{children}</div>
    </div>
  );
}

type ReviewerTab = "assessment" | "logs";
type ReviewChoice = "accept" | "reject" | null;
type IndicatorStatus = "passed" | "failed";

const EVIDENCE_CHECKLIST = [
  "Incident response policy document",
  "Past incident reports",
  "Escalation logs",
  "Review meeting minutes",
] as const;

export function MatrixReviewerPanel({ row, onClose, auditMode = "standard", layout = "drawer" }: MatrixReviewerPanelProps) {
  const readOnly = auditMode !== "standard";
  const isInline = layout === "inline";
  const inspectionLayout = auditMode === "inspection";
  const isUnderReview = auditMode === "underReview";
  /** Inspection + under review share the same compact assessment drawer (Figma). */
  const useReadOnlyFigmaAssessment = isUnderReview || inspectionLayout;
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<ReviewerTab>("assessment");
  const [reviewChoice, setReviewChoice] = useState<ReviewChoice>(row.status === "awaitingReview" ? null : "accept");
  const [indicatorStatus, setIndicatorStatus] = useState<IndicatorStatus>("passed");
  const [note, setNote] = useState("");
  const [logNote, setLogNote] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEvidenceDetailView, setIsEvidenceDetailView] = useState(false);
  const [selectedEvidenceFileId, setSelectedEvidenceFileId] = useState<string | null>(null);
  const [removedEvidenceIds, setRemovedEvidenceIds] = useState<Set<string>>(() => new Set());

  const isAwaitingReview = row.status === "awaitingReview";
  const showDecisionButtons = isAwaitingReview && activeTab === "assessment";

  useEffect(() => {
    setIsEvidenceDetailView(false);
    setSelectedEvidenceFileId(null);
    setRemovedEvidenceIds(new Set());
  }, [row.id]);

  const title = useMemo(() => {
    if (row.id === "d1") return "5.1.1 - Management Commitment";
    if (row.id === "d2") return "A.5.1 - Information Security Policies";
    return "5.1.1 - Management Commitment";
  }, [row.id]);

  const evidenceGuidanceBlock = (
    <div className="mt-6 border-t border-border-soft pt-5">
      <h5 className="text-[14px] font-semibold text-foreground">{t.matrix.reviewer.evidenceGuidance}</h5>
      <p className="mt-1.5 text-[12px] leading-relaxed text-secondary">{t.matrix.reviewer.evidenceBody}</p>
      <ul className="mt-3 space-y-2.5 text-[12px] font-medium">
        {EVIDENCE_CHECKLIST.map((item) => (
          <li key={item} className="flex items-center gap-2 text-foreground">
            <CheckmarkCircle16Filled className="text-[16px] text-success" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );

  const readOnlyEvidenceGuidanceAndDropZone = (
    <section className="mt-4 border-t border-border-soft pt-4 pb-2">
      <h5 className="text-[14px] font-semibold text-foreground">{t.matrix.reviewer.evidenceGuidance}</h5>
      <p className="mt-1.5 text-[12px] leading-relaxed text-secondary">{t.matrix.reviewer.evidenceBody}</p>
      <ul className="mt-3 space-y-2.5 text-[12px] font-medium">
        {EVIDENCE_CHECKLIST.map((item) => (
          <li key={item} className="flex items-center gap-2 text-foreground">
            <CheckmarkCircle16Filled className="h-4 w-4 shrink-0 text-success" />
            {item}
          </li>
        ))}
      </ul>
      <div
        className="mt-6 flex flex-col items-center justify-center rounded-[4px] border border-dashed border-border bg-surface-muted/60 px-6 py-10 text-center"
        role="img"
        aria-label={t.matrix.reviewer.dropZoneReadOnlyLabel}
      >
        <DocumentAdd20Regular className="text-[32px] text-muted" aria-hidden />
        <p className="pointer-events-none mt-3 text-[13px] text-secondary">
          {t.matrix.reviewer.dropZonePrefix}{" "}
          <span className="font-medium text-primary">{t.matrix.reviewer.dropZoneBrowse}</span>
        </p>
        <p className="pointer-events-none mt-1.5 text-[12px] text-muted">{t.matrix.reviewer.dropZoneFormats}</p>
      </div>
    </section>
  );

  const dropZoneCard = (
    <div className="flex flex-col items-center justify-center rounded-[4px] border border-dashed border-border-strong bg-surface-muted/40 px-6 py-10 text-center">
      <ArrowUpload16Regular className="text-[28px] text-muted" />
      <p className="mt-3 text-[13px] text-secondary">
        {t.matrix.reviewer.dropZonePrefix}{" "}
        <span className="font-medium text-primary">{t.matrix.reviewer.dropZoneBrowse}</span>
      </p>
    </div>
  );

  const renderUploadedEvidenceRows = (interactive: boolean, opts?: { showDelete?: boolean }) => {
    const showDelete = opts?.showDelete ?? false;
    const files = EVIDENCE_FILE_ROWS.filter((item) => !removedEvidenceIds.has(item.id));
    return (
      <div className="space-y-2">
        {files.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between gap-2 rounded-[4px] border border-border-soft bg-surface p-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)] ${interactive ? "cursor-pointer transition-colors hover:bg-surface-muted" : ""}`}
            onClick={
              interactive
                ? () => {
                    setSelectedEvidenceFileId(item.id);
                    setIsEvidenceDetailView(true);
                  }
                : undefined
            }
          >
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border-soft bg-surface-muted">
                <Document20Regular className="text-secondary" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-foreground">{item.label}</p>
                <p className="mt-0.5 text-[10px] uppercase text-muted">{item.meta}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {showDelete ? (
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded border border-border-soft text-danger hover:bg-surface-muted"
                  aria-label={t.matrix.reviewer.removeEvidence}
                  onClick={(e) => {
                    e.stopPropagation();
                    setRemovedEvidenceIds((prev) => new Set([...prev, item.id]));
                  }}
                >
                  <Delete16Regular className="h-4 w-4" />
                </button>
              ) : null}
              <Eye16Regular className="text-secondary" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <aside
        className={
          isInline
            ? "flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-surface"
            : "flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-surface"
        }
      >
        <header className="shrink-0 border-b border-border-soft px-5 pb-4 pt-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[20px] font-semibold leading-none text-foreground">{title}</h3>
              <p className="mt-2 text-[12px] text-secondary">{t.matrix.reviewer.subtitle}</p>
            </div>
            {!isInline ? (
              <button type="button" aria-label="Close reviewer panel" onClick={onClose} className="text-secondary hover:text-foreground">
                <Dismiss20Regular />
              </button>
            ) : null}
          </div>
          <div className="mt-5 flex items-center gap-6 text-[14px] font-medium">
            <button type="button" onClick={() => setActiveTab("assessment")} className={`border-b-[3px] pb-1.5 ${activeTab === "assessment" ? "border-primary text-foreground" : "border-transparent text-secondary"}`}>
              {t.matrix.reviewer.tabs.assessment}
            </button>
            <button type="button" onClick={() => setActiveTab("logs")} className={`border-b-[3px] pb-1.5 ${activeTab === "logs" ? "border-primary text-foreground" : "border-transparent text-secondary"}`}>
              {t.matrix.reviewer.tabs.logs}
            </button>
          </div>
        </header>

        {activeTab === "assessment" ? (
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            {useReadOnlyFigmaAssessment ? (
              <div>
                <section>
                  <h5 className="text-[14px] font-semibold text-foreground">Incident Response Requirements</h5>
                  <p className="mt-1.5 text-[13px] leading-[1.6] text-secondary">{t.matrix.reviewer.requirementsBody}</p>
                  <div className="mt-5">
                    <h5 className="text-[14px] font-semibold text-foreground">Required Elements</h5>
                    <ul className="mt-2 space-y-1.5 text-[13px] text-secondary">
                      <li>• Defined incident categories</li>
                      <li>• Assigned incident response roles</li>
                      <li>• Escalation matrix</li>
                      <li>• Documentation procedures</li>
                      <li>• Post-incident review process</li>
                    </ul>
                  </div>
                </section>

                <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border-soft pt-3">
                  <span className="text-[12px] font-medium text-secondary">{t.matrix.reviewer.indicatorReview}</span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border border-border-soft bg-surface-muted px-2 py-0.5 text-[11px] font-semibold tabular-nums ${
                      indicatorStatus === "passed" ? "text-foreground" : "text-danger"
                    }`}
                  >
                    {indicatorStatus === "passed" ? (
                      <CheckmarkCircle16Filled className="h-3.5 w-3.5 shrink-0 text-success" aria-hidden />
                    ) : (
                      <Warning16Filled className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    )}
                    {indicatorStatus === "passed" ? t.matrix.reviewer.indicatorPassed : t.matrix.reviewer.indicatorFailed}
                  </span>
                </div>

                {readOnlyEvidenceGuidanceAndDropZone}
              </div>
            ) : showDecisionButtons ? (
              <div className={readOnly ? "pointer-events-none opacity-55" : ""}>
              <>
                <div className="rounded-[4px] border border-border-soft p-4">
                  <div className="inline-flex items-start gap-2.5">
                    <Document20Regular className="mt-0.5 text-muted" />
                    <div>
                      <p className="text-[14px] font-medium text-foreground">Risk Assessment Report</p>
                      <span className="mt-1.5 inline-flex items-center gap-1 rounded bg-[#d8f4ff] px-2 py-0.5 text-[10px] font-medium text-primary">
                        <span className="text-[12px] leading-none mb-[1px]">↹</span> Linked from Central Asset Manager
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-[12px] text-secondary">
                    <Person16Regular className="text-foreground" />
                    <span className="font-medium text-foreground">Sarah Lee</span> <span className="text-muted mx-0.5">•</span> 5 Days ago
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button type="button" className={`h-[34px] rounded-[4px] text-[13px] font-semibold transition-colors ${reviewChoice === "accept" || reviewChoice === null ? "bg-[#00ca48] text-white hover:bg-[#00b03f]" : "bg-sidebar text-muted border border-border-soft"}`} onClick={() => setReviewChoice("accept")}>
                    {t.matrix.reviewer.accept}
                  </button>
                  <button type="button" className={`h-[34px] rounded-[4px] text-[13px] font-semibold transition-colors ${reviewChoice === "reject" || reviewChoice === null ? "bg-[#d13438] text-white hover:bg-[#b02a2f]" : "bg-sidebar text-muted border border-border-soft"}`} onClick={() => setReviewChoice("reject")}>
                    {t.matrix.reviewer.reject}
                  </button>
                </div>
                {reviewChoice === "reject" ? (
                  <div className="mt-3 flex items-start gap-2 rounded-[3px] border border-[#f4d58f] bg-[#fff6d8] px-3 py-2 text-[12px] text-[#8a6d00]">
                    <Warning16Filled className="mt-0.5 shrink-0" />
                    <span>{t.matrix.reviewer.rejectHint}</span>
                  </div>
                ) : null}
                <Textarea className="mt-3 min-h-[90px] w-full" placeholder={t.matrix.reviewer.addNote} value={note} onChange={(_, data) => setNote(data.value)} />
                <div className="mt-3 flex justify-end gap-2">
                  <Button appearance="outline" className="h-[34px] rounded-[4px] border-border-strong px-4 font-medium">{t.matrix.common.cancel}</Button>
                  <Button appearance="primary" className="h-[34px] rounded-[4px] px-4 font-medium">{t.matrix.common.send}</Button>
                </div>
              </>
              </div>
            ) : isEvidenceDetailView ? (
              <>
                <div>
                  <div className="flex items-start gap-3">
                    <div className="relative flex h-12 w-10 shrink-0 items-center justify-center rounded-sm bg-[#e1dfdd]">
                      <div className="absolute right-0 top-0 h-0 w-0 border-b-[12px] border-l-[12px] border-b-black/10 border-l-transparent bg-surface"></div>
                    </div>
                    <div className="flex flex-col items-start pt-0.5">
                      <p className="text-[14px] font-medium text-foreground">Risk Assessment Report</p>
                      <span className="mt-1.5 inline-flex items-center gap-1 rounded bg-[#d8f4ff] px-2 py-0.5 text-[10px] font-medium text-primary">
                        <span className="mb-[1px] text-[12px] leading-none">↹</span> Linked from Central Asset Manager
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[12px] text-secondary">
                    <Person16Regular className="text-foreground" />
                    <span className="font-medium text-foreground">Sarah Lee</span> <span className="mx-0.5 text-muted">•</span> 5 Days ago
                  </div>
                </div>

                <div className={readOnly ? "pointer-events-none opacity-55" : ""}>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setReviewChoice("accept")}
                      className={`h-[34px] rounded-[4px] text-[13px] font-semibold transition-colors ${reviewChoice === "reject" ? "bg-[#f3f2f1] text-[#b3b0ad]" : "bg-[#00ca48] text-white hover:bg-[#00b03f]"}`}
                    >
                      {t.matrix.reviewer.accept}
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewChoice("reject")}
                      className={`h-[34px] rounded-[4px] text-[13px] font-semibold transition-colors ${reviewChoice === "reject" ? "bg-[#f3f2f1] text-[#b3b0ad]" : "bg-[#d13438] text-white hover:bg-[#b02a2f]"}`}
                    >
                      {t.matrix.reviewer.reject}
                    </button>
                  </div>

                  {reviewChoice === "reject" && (
                    <div className="mt-4">
                      <div className="flex items-start gap-2.5 rounded-[4px] border border-[#fde7a9] bg-[#fff4ce] px-3 py-2.5 text-[12px] text-[#795700]">
                        <QuestionCircle16Regular className="mt-0.5 shrink-0 text-[#d83b01]" />
                        <span>{t.matrix.reviewer.rejectHint}</span>
                      </div>
                      <Textarea className="mt-3 min-h-[90px] w-full" placeholder={t.matrix.reviewer.addNote} value={note} onChange={(_, data) => setNote(data.value)} />
                      <div className="mt-3 flex justify-end gap-2">
                        <Button appearance="outline" className="h-[34px] rounded-[4px] border-border-strong px-4 font-medium" onClick={() => setReviewChoice(null)}>{t.matrix.common.cancel}</Button>
                        <Button appearance="primary" className="h-[34px] rounded-[4px] px-4 font-medium">{t.matrix.common.send}</Button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="mt-6 flex w-full items-center justify-between rounded-[4px] border border-border-soft bg-surface px-4 py-3 text-[13px] shadow-sm transition-colors hover:bg-surface-muted"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  <span className="inline-flex items-center gap-3 font-medium text-foreground">
                    <Document20Regular className="text-foreground" />
                    {t.matrix.reviewer.viewAttached}
                  </span>
                  <ChevronRight16Regular className="text-secondary" />
                </button>

                <section className="mt-6 border-t border-border-soft pt-5 pb-6">
                  <h5 className="text-[14px] font-semibold text-foreground">Incident Response Requirements</h5>
                  <p className="mt-1.5 text-[13px] leading-[1.6] text-secondary">{t.matrix.reviewer.requirementsBody}</p>

                  <div className="mt-5">
                    <h5 className="text-[14px] font-semibold text-foreground">Required Elements</h5>
                    <ul className="mt-2 space-y-1.5 text-[13px] text-secondary">
                      <li>• Defined incident categories</li>
                      <li>• Assigned incident response roles</li>
                      <li>• Escalation matrix</li>
                      <li>• Documentation procedures</li>
                      <li>• Post-incident review process</li>
                    </ul>
                  </div>

                  <div className="mt-6 border-t border-border-soft pt-5">
                    <h5 className="text-[14px] font-semibold text-foreground">{t.matrix.reviewer.evidenceGuidance}</h5>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-secondary">{t.matrix.reviewer.evidenceBody}</p>
                    <ul className="mt-3 space-y-2.5 text-[12px] font-medium">
                      {["Incident response policy document", "Past incident reports", "Escalation logs", "Review meeting minutes"].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-foreground">
                          <CheckmarkCircle16Filled className="text-[16px] text-success" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {readOnly ? (
                  <EvidenceUploadBlock blurred>
                    <h5 className="mb-3 text-[14px] font-semibold text-foreground">Uploaded Evidence</h5>
                    {dropZoneCard}
                    <div className="mt-4">{renderUploadedEvidenceRows(false)}</div>
                  </EvidenceUploadBlock>
                ) : null}
              </>
            ) : (
              <>
                <section className="mt-4">
                  <h5 className="text-[14px] font-semibold text-foreground">Incident Response Requirements</h5>
                  <p className="mt-1.5 text-[13px] leading-[1.6] text-secondary">{t.matrix.reviewer.requirementsBody}</p>

                  <div className="mt-5">
                    <h5 className="text-[14px] font-semibold text-foreground">Required Elements</h5>
                    <ul className="mt-2 space-y-1.5 text-[13px] text-secondary">
                      <li>• Defined incident categories</li>
                      <li>• Assigned incident response roles</li>
                      <li>• Escalation matrix</li>
                      <li>• Documentation procedures</li>
                      <li>• Post-incident review process</li>
                    </ul>
                  </div>

                  <div className="mt-6 border-t border-border-soft pt-5">
                    <h5 className="text-[14px] font-semibold text-foreground">{t.matrix.reviewer.indicatorReview}</h5>
                    <div className="mt-3 inline-flex items-center gap-2.5 text-[13px] text-secondary">
                      Indicator Status:
                      <span className={`inline-flex items-center gap-1.5 font-medium ${indicatorStatus === "passed" ? "text-success" : "text-danger"}`}>
                        {indicatorStatus === "passed" ? <CheckmarkCircle16Filled /> : <Warning16Filled />}
                        {indicatorStatus === "passed" ? "Passed" : "Failed"}
                      </span>
                      <select
                        aria-label="Indicator status"
                        value={indicatorStatus}
                        onChange={(e) => setIndicatorStatus(e.target.value as IndicatorStatus)}
                        className="ml-1 rounded-[4px] border border-border-strong bg-surface px-2 py-1 text-[13px] text-foreground shadow-sm"
                      >
                        <option value="passed">Passed</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-border-soft pt-5">
                    <h5 className="text-[14px] font-semibold text-foreground">{t.matrix.reviewer.officialAssessment}</h5>
                    <Textarea className="mt-3 min-h-[90px] w-full" value={note} onChange={(_, data) => setNote(data.value)} />
                    <div className="mt-3 flex justify-end gap-2">
                      <Button appearance="outline" className="h-[34px] rounded-[4px] border-border-strong px-4 font-medium">{t.matrix.common.cancel}</Button>
                      <Button appearance="primary" className="h-[34px] rounded-[4px] px-4 font-medium">{t.matrix.common.send}</Button>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-border-soft pt-5 pb-6">
                    <h5 className="text-[14px] font-semibold text-foreground">Uploaded Evidence</h5>
                    {!readOnly ? <div className="mt-3">{dropZoneCard}</div> : null}
                    <div className="mt-4">{renderUploadedEvidenceRows(!readOnly, { showDelete: !readOnly })}</div>
                  </div>
                </section>
              </>
            )}
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col bg-[#f5f5f5]">
            <div
              className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden scroll-smooth [scrollbar-gutter:stable] [scrollbar-width:thin] pl-4 pr-2 pt-4 pb-6 sm:pl-5 sm:pr-3"
            >
              <div className="space-y-5">
                {["Yesterday", "Today"].map((day) => (
                  <div key={day}>
                    <div className="mb-3 flex items-center gap-3" role="separator">
                      <div className="h-px min-w-0 flex-1 bg-border-soft" />
                      <span className="shrink-0 bg-[#f5f5f5] px-2 text-[11px] font-semibold uppercase tracking-wide text-secondary">
                        {day}
                      </span>
                      <div className="h-px min-w-0 flex-1 bg-border-soft" />
                    </div>
                    <ul className="min-w-0 space-y-3 pr-0.5">
                      {Array.from({ length: 2 }).map((_, idx) => (
                        <li
                          key={`${day}-${idx}`}
                          className="min-w-0 list-none overflow-hidden rounded-md border border-border bg-white p-4 shadow-sm"
                        >
                          <div className="mb-2.5 flex min-w-0 items-start justify-between gap-3">
                            <p className="min-w-0 break-words text-[13px] font-medium text-primary">Elysaa Jackson</p>
                            <span className="shrink-0 tabular-nums text-[11px] text-muted">1:15 PM</span>
                          </div>
                          <p className="min-w-0 break-words text-[13px] leading-relaxed text-foreground">
                            {idx === 0 && day === "Yesterday"
                              ? "I reviewed the SOC2_policy_v4.1.pdf. Section 7.3 refers to Appendix C, which seems to be missing. Could someone verify if it should be included?"
                              : idx === 1 && day === "Yesterday"
                                ? "Great. I'll share my thoughts on the proposal by EOD tomorrow."
                                : idx === 0 && day === "Today"
                                  ? "Reviewed the IS_policy_v3.3.pdf. Section 4.2 reference an anex that isn't included in the upload. can someone confirm if it exists?."
                                  : "Thanks for the update. Looking forward to reviewing the proposal."}
                          </p>
                          {idx === 0 && day === "Yesterday" && (
                            <div className="mt-3 w-full rounded border border-border-soft bg-surface-muted px-3 py-2.5 text-center text-[11px] leading-snug text-secondary">
                              Status changed to{" "}
                              <span className="inline-block rounded bg-[#0078d4] px-1.5 py-0.5 font-medium text-white">Blue</span>{" "}
                              {">"}{" "}
                              <span className="inline-block rounded bg-[#ffb900] px-1.5 py-0.5 font-medium text-white">Amber</span>{" "}
                              by <span className="font-medium text-foreground">Advisor Deet</span>
                            </div>
                          )}
                          {idx === 1 && day === "Yesterday" && (
                            <div className="mt-3 w-full rounded border border-border-soft bg-surface-muted px-3 py-2.5 text-center text-[11px] leading-snug text-secondary">
                              New version of <span className="font-medium italic text-foreground">Policy.pdf</span> uploaded by{" "}
                              <span className="font-medium text-foreground">Client Everly</span>
                            </div>
                          )}
                          {idx === 0 && day === "Today" && (
                            <div className="mt-3 w-full rounded border border-border-soft bg-surface-muted px-3 py-2.5 text-center text-[11px] leading-snug text-secondary">
                              Assessment completed for{" "}
                              <span className="inline-block rounded bg-[#00ca48] px-1.5 py-0.5 font-medium text-white">CH-01</span>{" "}
                              <span className="font-bold text-[#00ca48]">100%</span> by <span className="font-medium text-foreground">Fydron</span>
                            </div>
                          )}
                          {idx === 1 && day === "Today" && (
                            <div className="mt-3 w-full rounded border border-border-soft bg-surface-muted px-3 py-2.5 text-center text-[11px] leading-snug text-secondary">
                              New version of <span className="font-medium italic text-foreground">Policy.pdf</span> uploaded by{" "}
                              <span className="font-medium text-foreground">Client Everly</span>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className={`shrink-0 border-t border-border-soft bg-surface px-4 py-3 sm:px-5 sm:py-4 ${readOnly ? "pointer-events-none opacity-55" : ""}`}>
              <div className="flex min-w-0 items-center gap-2">
                <Input
                  className="h-9 min-h-9 min-w-0 flex-1 text-[13px]"
                  placeholder={t.matrix.reviewer.logInput}
                  value={logNote}
                  onChange={(_, data) => setLogNote(data.value)}
                />
                <Button appearance="primary" className="h-[36px] shrink-0 rounded-[4px] px-5 font-medium">
                  {t.matrix.common.send}
                </Button>
              </div>
            </div>
          </div>
        )}
      </aside>

      <DocumentPreviewModal
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        layout={isInline ? "inline" : "drawer"}
        kind={demoAttachmentKindForEvidenceId(selectedEvidenceFileId ?? "1")}
        documentTitle={
          EVIDENCE_FILE_ROWS.find((f) => f.id === (selectedEvidenceFileId ?? "1"))?.label ?? "Document"
        }
      />
    </>
  );
}
