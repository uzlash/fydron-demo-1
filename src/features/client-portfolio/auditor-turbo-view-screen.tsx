"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Text } from "@fluentui/react-components";
import { ArrowSync16Regular, Document16Regular, Document20Regular } from "@fluentui/react-icons";
import { AuditorTurboViewReviewerColumn } from "@/features/client-portfolio/components/auditor-turbo-view-reviewer-column";
import { getClientTurboDossierData } from "@/features/client-portfolio/mock-data";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { DashboardTopbar } from "@/features/dashboard/components/dashboard-topbar";
import { NotificationCenter } from "@/features/dashboard/components/notification-center";
import { notificationItems } from "@/features/dashboard/mock-data";
import { useLocale } from "@/i18n/locale-context";
import { AppPageFrame, AppMainCard } from "@/components/app-content-shell";
import { InlineSampleDocumentPreview } from "@/components/inline-sample-document-preview";
import { TURBO_DOSSIER_EVIDENCE_FILE_ROWS } from "@/features/client-portfolio/turbo-dossier-constants";
import { RightDrawerFrame, RIGHT_DRAWER_WIDTH_440 } from "@/components/right-drawer-frame";
import { demoAttachmentKindForEvidenceId, type DemoAttachmentKind } from "@/lib/sample-documents";

const TURBO_VIEW_ROW_COUNT = 5;

type AuditorTurboViewScreenProps = {
  clientId: string;
  dossierId: string;
};

export function AuditorTurboViewScreen({ clientId, dossierId }: AuditorTurboViewScreenProps) {
  const { t } = useLocale();
  const av = t.clientPortfolio.turboDossier.auditorView;
  const turbo = t.clientPortfolio.turboDossier;
  const searchParams = useSearchParams();

  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [activeDocTab, setActiveDocTab] = useState(0);
  /** Center viewer: file tabs vs evidence from the right column */
  const [mainDocumentSource, setMainDocumentSource] = useState<"tabs" | "evidence">("tabs");
  const [mainEvidenceId, setMainEvidenceId] = useState<string | null>(null);

  const data = useMemo(() => getClientTurboDossierData(clientId, dossierId), [clientId, dossierId]);
  const rows = useMemo(() => (data ? data.rows.slice(0, TURBO_VIEW_ROW_COUNT) : []), [data]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedRow = rows[selectedIndex] ?? null;

  useEffect(() => {
    const id = searchParams.get("rowId");
    if (!id || rows.length === 0) return;
    const idx = rows.findIndex((r) => r.id === id);
    if (idx >= 0) setSelectedIndex(idx);
  }, [searchParams, rows]);

  useEffect(() => {
    setMainDocumentSource("tabs");
    setMainEvidenceId(null);
  }, [selectedRow?.id]);

  const onPrev = useCallback(() => {
    setSelectedIndex((i) => Math.max(0, i - 1));
  }, []);

  const onNext = useCallback(() => {
    setSelectedIndex((i) => Math.min(rows.length - 1, i + 1));
  }, [rows.length]);

  const dossierLink = `/client-portfolio/${clientId}/dossier/${dossierId}`;

  if (!data || !selectedRow) {
    return null;
  }

  const fileTabs = [
    av.fileTabs.incidentResponse,
    av.fileTabs.incidentSummaries,
    av.fileTabs.analysis,
    av.fileTabs.resolutionTimelines,
    av.fileTabs.remediation,
  ];
  const activeTabLabel = fileTabs[activeDocTab] ?? fileTabs[0];
  const documentPreviewKind: DemoAttachmentKind = useMemo(() => {
    if (mainDocumentSource === "evidence" && mainEvidenceId) {
      return demoAttachmentKindForEvidenceId(mainEvidenceId);
    }
    return activeDocTab === 1 ? "docx" : "pdf";
  }, [mainDocumentSource, mainEvidenceId, activeDocTab]);

  const fileNameInHeader = useMemo(() => {
    const ext = documentPreviewKind === "docx" ? ".docx" : ".pdf";
    if (mainDocumentSource === "evidence" && mainEvidenceId) {
      const ev = TURBO_DOSSIER_EVIDENCE_FILE_ROWS.find((f) => f.id === mainEvidenceId);
      if (ev) return `${ev.label}${ext}`;
    }
    return `${activeTabLabel}${ext}`;
  }, [mainDocumentSource, mainEvidenceId, documentPreviewKind, activeTabLabel]);

  const mainPreviewKey = useMemo(
    () =>
      mainDocumentSource === "evidence" && mainEvidenceId
        ? `evidence-${mainEvidenceId}-${documentPreviewKind}`
        : `tab-${activeDocTab}-${documentPreviewKind}`,
    [mainDocumentSource, mainEvidenceId, activeDocTab, documentPreviewKind],
  );

  const reviewed = 0;
  const total = rows.length;

  return (
    <AppPageFrame>
      <DashboardSidebar />
      <AppMainCard>
      <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-surface">
        <DashboardTopbar
          title={av.topbarTitle}
          onToggleNotifications={() => setIsNotificationCenterOpen((v) => !v)}
          hasUnreadNotifications={notificationItems.some((item) => item.unread)}
        />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="shrink-0 border-b border-border-soft bg-surface px-4 py-3 sm:px-5">
            <nav className="text-[12px] text-muted" aria-label="Breadcrumb">
              <Link className="hover:text-foreground" href="/matrix">
                {turbo.breadcrumbMatrix}
              </Link>
              <span> &gt; </span>
              <Link className="hover:text-foreground" href="/client-portfolio">
                {turbo.breadcrumbClientPortfolio}
              </Link>
              <span> &gt; </span>
              <Link className="hover:text-foreground" href={dossierLink}>
                {turbo.breadcrumbDossierPrefix} {data.frameworkTitle}
              </Link>
              <span> &gt; </span>
              <span className="text-secondary">{av.breadcrumbTurbo}</span>
            </nav>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-[22px] font-semibold leading-tight text-foreground sm:text-[26px]">{av.pageTitle}</h1>
              <Button
                appearance="outline"
                className="h-9 w-fit shrink-0 self-start border-border-strong font-medium sm:self-auto"
                disabled
              >
                {av.reviewingEvidence}
              </Button>
            </div>
          </div>

          <div className="flex min-h-0 min-w-0 flex-1">
            <div className="flex w-[280px] shrink-0 flex-col border-r border-border bg-surface">
              <div className="shrink-0 border-b border-border-soft px-4 py-3">
                <p className="text-[13px] font-semibold text-foreground">{av.indicatorsHeading}</p>
                <label className="mt-2 block text-[11px] font-medium text-muted" htmlFor="turbo-chapter">
                  {av.chapterLabel}
                </label>
                <select
                  id="turbo-chapter"
                  className="mt-1 w-full rounded border border-border-strong bg-surface px-2 py-1.5 text-[13px] text-foreground shadow-sm"
                  defaultValue="c1"
                >
                  <option value="c1">{av.chapter1}</option>
                </select>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto py-1">
                {rows.map((row, idx) => {
                  const isActive = idx === selectedIndex;
                  return (
                    <button
                      key={row.id}
                      type="button"
                      onClick={() => {
                        setSelectedIndex(idx);
                        setActiveDocTab(0);
                      }}
                      className={`flex w-full flex-col gap-0.5 border-b border-border-soft px-4 py-3 text-left transition-colors ${
                        isActive ? "bg-[#e8f4ff] text-foreground" : "bg-surface hover:bg-surface-muted"
                      }`}
                    >
                      <span className="text-[13px] font-medium leading-snug">{row.title}</span>
                      <span className="mt-0.5 inline-flex items-center gap-1.5 text-[12px] text-secondary">
                        <ArrowSync16Regular className="h-3.5 w-3.5" />
                        {av.listStatusToReview}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="shrink-0 border-t border-border-soft px-4 py-3">
                <p className="text-[12px] font-medium text-secondary">
                  {av.progressReviewed.replace("{reviewed}", String(reviewed)).replace("{total}", String(total))}
                </p>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: total > 0 ? `${(reviewed / total) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            </div>

            <div className="flex min-h-0 min-w-0 flex-1 flex-col border-r border-border bg-surface">
              {/* Figma: title + Document pill inline; file tabs = bordered rounded pills w/ doc icon; read-only bar under tabs */}
              <div className="shrink-0 border-b border-border-soft bg-surface px-4 py-3 sm:px-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-wrap items-center gap-2.5">
                    <h2 className="text-[15px] font-semibold leading-tight text-foreground sm:text-[16px]">
                      {selectedRow.title}
                    </h2>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded border border-border bg-[#f3f2f1] px-2.5 py-0.5 text-[11px] font-medium text-secondary">
                      <Document16Regular className="h-3.5 w-3.5 text-muted" />
                      {av.documentBadge}
                    </span>
                  </div>
                  <Button
                    appearance="outline"
                    className="h-8 min-h-8 shrink-0 border-border text-[13px] font-medium"
                  >
                    {av.allDocs}
                  </Button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {fileTabs.map((label, i) => {
                    const isActive = mainDocumentSource === "tabs" && activeDocTab === i;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => {
                          setMainDocumentSource("tabs");
                          setMainEvidenceId(null);
                          setActiveDocTab(i);
                        }}
                        className={`inline-flex max-w-full min-w-0 items-center gap-1.5 rounded border px-2.5 py-1.5 text-left text-[12px] font-medium transition-colors ${
                          isActive
                            ? "border-border-strong bg-[#f3f2f1] text-foreground"
                            : "border-border bg-white text-secondary shadow-sm hover:border-border-strong hover:text-foreground"
                        } `}
                      >
                        <Document16Regular
                          className={`h-4 w-4 shrink-0 ${isActive ? "text-secondary" : "text-muted"}`}
                          aria-hidden
                        />
                        <span className="min-w-0 truncate">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto bg-[#f3f2f1]">
                <div className="flex h-[33px] w-full min-w-0 shrink-0 items-center justify-between gap-3 border-b border-border bg-[#edebe9] px-3 sm:px-4">
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <Document20Regular className="h-4 w-4 shrink-0 text-secondary" aria-hidden />
                    <span className="truncate text-[12px] font-medium text-foreground">{fileNameInHeader}</span>
                  </div>
                  <Text size={200} className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-[#605e5c]">
                    {av.readOnlyTag}
                  </Text>
                </div>

                <div className="flex min-h-0 flex-1 flex-col p-3 sm:p-4">
                  <div className="mx-auto flex h-full min-h-0 w-full max-w-[720px] flex-1 flex-col overflow-hidden rounded border border-border bg-white shadow-sm">
                    <div className="min-h-0 flex-1">
                      <InlineSampleDocumentPreview
                        key={mainPreviewKey}
                        kind={documentPreviewKind}
                        documentTitle={fileNameInHeader}
                        className="min-h-[min(50vh,480px)]"
                      />
                    </div>
                  </div>
                  <p
                    className="flex h-[33px] w-full shrink-0 items-center justify-center text-center text-[10px] font-medium leading-none uppercase tracking-[0.12em] text-muted"
                    aria-label={av.readOnlyPreview}
                  >
                    {av.readOnlyPreview}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex h-full min-h-0 w-[440px] shrink-0">
              <AuditorTurboViewReviewerColumn
                key={selectedRow.id}
                row={selectedRow}
                onPrev={onPrev}
                onNext={onNext}
                canPrev={selectedIndex > 0}
                canNext={selectedIndex < rows.length - 1}
                activeMainEvidenceId={mainDocumentSource === "evidence" ? mainEvidenceId : null}
                onEvidenceSelect={(id) => {
                  setMainDocumentSource("evidence");
                  setMainEvidenceId(id);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      </AppMainCard>

      {isNotificationCenterOpen ? (
        <>
          <button
            type="button"
            aria-label="Close notifications panel"
            className="fixed inset-0 z-[100] bg-black/45"
            onClick={() => setIsNotificationCenterOpen(false)}
          />
          <RightDrawerFrame widthClass={RIGHT_DRAWER_WIDTH_440} position="fixed" zClass="z-[110]">
            <NotificationCenter items={notificationItems} />
          </RightDrawerFrame>
        </>
      ) : null}
    </AppPageFrame>
  );
}
