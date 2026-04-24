"use client";

import { useEffect, useMemo, useState } from "react";
import { Checkbox } from "@fluentui/react-components";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { LockClosed16Filled } from "@fluentui/react-icons";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { DashboardTopbar } from "@/features/dashboard/components/dashboard-topbar";
import { NotificationCenter } from "@/features/dashboard/components/notification-center";
import { notificationItems } from "@/features/dashboard/mock-data";
import { fetchMatrixActivityItems, fetchMatrixComplianceChapters, fetchMatrixDossierData } from "@/features/matrix/mock-data";
import { ActivityTimelinePanel } from "@/features/matrix/components/activity-timeline-panel";
import { MatrixAddTeamDialog } from "@/features/matrix/components/matrix-add-team-dialog";
import { ComplianceOverviewPanel } from "@/features/matrix/components/compliance-overview-panel";
import { MatrixDossierTable } from "@/features/matrix/components/matrix-dossier-table";
import { MatrixDossierToolbar } from "@/features/matrix/components/matrix-dossier-toolbar";
import { MatrixChangeWorkflowConfirmModal } from "@/features/matrix/components/matrix-change-workflow-confirm-modal";
import { MatrixEditDossierModal } from "@/features/matrix/components/matrix-edit-dossier-modal";
import type { MatrixEditDossierWorkflow } from "@/features/matrix/components/matrix-edit-dossier-modal";
import { MatrixContributorRequirementView } from "@/features/matrix/components/matrix-contributor-requirement-view";
import { MatrixReviewerPanel } from "@/features/matrix/components/matrix-reviewer-panel";
import { MatrixFrameworkMigrationModal } from "@/features/matrix/components/matrix-framework-migration-modal";
import { MatrixInspectionBanner } from "@/features/matrix/components/matrix-inspection-banner";
import { MatrixUnderReviewBanner } from "@/features/matrix/components/matrix-under-review-banner";
import { MatrixTableSkeleton } from "@/features/matrix/components/matrix-table-skeleton";
import {
  MATRIX_ACTIVATION_QUERY_KEY,
  type MatrixActivityTab,
  type MatrixAddTeamActivationPreset,
  type MatrixDossierAuditMode,
  type MatrixDossierMode,
  type MatrixDossierRow,
} from "@/features/matrix/types";
import { useLocale } from "@/i18n/locale-context";
import { AppPageFrame, AppMainCard } from "@/components/app-content-shell";
import { RightDrawerFrame, RIGHT_DRAWER_WIDTH_360, RIGHT_DRAWER_WIDTH_440 } from "@/components/right-drawer-frame";

type MatrixDossierScreenProps = {
  dossierId: string;
};

type SidePanel = "none" | "activity" | "compliance" | "reviewer";

function activationPresetFromSearch(raw: string | null): MatrixAddTeamActivationPreset {
  if (raw === "standard") return "standard";
  if (raw === "direct") return "direct";
  return "default";
}

export function MatrixDossierScreen({ dossierId }: MatrixDossierScreenProps) {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const addTeamActivationPreset = activationPresetFromSearch(searchParams.get(MATRIX_ACTIVATION_QUERY_KEY));
  const [mode, setMode] = useState<MatrixDossierMode>("full");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [panel, setPanel] = useState<SidePanel>("none");
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [activeReviewerRow, setActiveReviewerRow] = useState<MatrixDossierRow | null>(null);
  const [activityTab, setActivityTab] = useState<MatrixActivityTab>("all");
  const [auditMode, setAuditMode] = useState<MatrixDossierAuditMode>("standard");
  const [inspectionBannerDismissed, setInspectionBannerDismissed] = useState(false);
  const [isMigrationModalOpen, setIsMigrationModalOpen] = useState(false);
  const [isEditDossierOpen, setIsEditDossierOpen] = useState(false);
  const [isChangeWorkflowConfirmOpen, setIsChangeWorkflowConfirmOpen] = useState(false);
  const [contributorView, setContributorView] = useState(false);

  useEffect(() => {
    if (auditMode !== "inspection") {
      setInspectionBannerDismissed(false);
    }
  }, [auditMode]);

  const dossierQuery = useQuery({
    queryKey: ["matrix-dossier", dossierId, mode, auditMode],
    queryFn: () => fetchMatrixDossierData(mode, auditMode),
  });
  const activityQuery = useQuery({
    queryKey: ["matrix-activity", dossierId],
    queryFn: fetchMatrixActivityItems,
  });
  const complianceQuery = useQuery({
    queryKey: ["matrix-compliance", dossierId],
    queryFn: fetchMatrixComplianceChapters,
  });

  const rows = dossierQuery.data?.rows ?? [];
  const allSelected = rows.length > 0 && selectedIds.length === rows.length;

  useEffect(() => {
    if (rows.length === 0) {
      setContributorView(false);
    }
  }, [rows.length]);
  const title = `${t.matrix.dossier.titlePrefix}: ${dossierQuery.data?.meta.id ?? "ISO 27001"} - ${dossierQuery.data?.meta.organizationName ?? "Medical Center X"}`;
  const showSkeleton = dossierQuery.isPending || mode === "loading";
  const showEmpty = !showSkeleton && rows.length === 0;

  const breadcrumb = useMemo(
    () => [t.matrix.dossier.breadcrumbRoot, t.matrix.dossier.breadcrumbMid, `${t.matrix.dossier.breadcrumbDossier} ${dossierId.toUpperCase()}`],
    [dossierId, t.matrix.dossier.breadcrumbDossier, t.matrix.dossier.breadcrumbMid, t.matrix.dossier.breadcrumbRoot],
  );

  const editDossierDefaultName = useMemo(() => {
    const meta = dossierQuery.data?.meta;
    if (!meta) return "ISO 27001 - Medical Center X";
    return `${meta.id} - ${meta.organizationName}`;
  }, [dossierQuery.data?.meta]);

  const editDossierDefaultWorkflow: MatrixEditDossierWorkflow =
    addTeamActivationPreset === "direct" ? "direct" : "standard";

  const toggleOne = (id: string) => {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds([]);
      return;
    }
    setSelectedIds(rows.map((row) => row.id));
  };

  return (
    <AppPageFrame>
      <DashboardSidebar />
      <AppMainCard>
      <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-surface">
        {auditMode === "inspection" && !inspectionBannerDismissed ? (
          <MatrixInspectionBanner
            onReviewUpgrade={() => setIsMigrationModalOpen(true)}
            onDismiss={() => setInspectionBannerDismissed(true)}
          />
        ) : null}
        {auditMode === "underReview" ? <MatrixUnderReviewBanner /> : null}
        <DashboardTopbar
          title={t.dashboard.nav.matrix}
          onToggleNotifications={() => {
            setPanel("none");
            setIsNotificationCenterOpen((currentValue) => !currentValue);
          }}
          hasUnreadNotifications={notificationItems.some((item) => item.unread)}
        />

        <div className="flex min-h-0 min-w-0 flex-1">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 py-4 sm:px-5">
            <div className="shrink-0 text-[12px] text-muted">
              {breadcrumb.join("  >  ")}
            </div>

            <div className="mt-3 flex shrink-0 items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h1 className="text-[32px] font-semibold leading-none text-foreground">{title}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-secondary">
                  <span className="inline-flex rounded-[3px] bg-surface-muted px-2 py-1">{t.matrix.dossier.frameworkVersion}: {dossierQuery.data?.meta.frameworkVersion ?? "2022"}</span>
                  <button
                    type="button"
                    className={`inline-flex rounded-[3px] px-2 py-1 ${(dossierQuery.data?.meta.overallCompliance ?? 0) >= 100 ? "bg-[#e8f7ee] font-medium text-[#0b5c2e]" : "bg-surface-muted"}`}
                    onClick={() => setPanel("compliance")}
                  >
                    {t.matrix.dossier.overallCompliance}: {dossierQuery.data?.meta.overallCompliance ?? 0}%
                  </button>
                  <button
                    type="button"
                    className="inline-flex rounded-[3px] bg-surface-muted px-2 py-1"
                    onClick={() => {
                      setIsNotificationCenterOpen(false);
                      setPanel("activity");
                    }}
                  >
                    {t.matrix.dossier.lastSynced}: {dossierQuery.data?.meta.lastSynced ?? "0 hours ago"}
                  </button>
                </div>
                <div className="mt-2">
                  <Checkbox
                    label={t.matrix.dossier.contributorView}
                    checked={contributorView}
                    disabled={showSkeleton || rows.length === 0}
                    onChange={(_, data) => {
                      const next = Boolean(data.checked);
                      setContributorView(next);
                      setPanel("none");
                      setActiveReviewerRow(null);
                    }}
                  />
                </div>
              </div>
              <MatrixDossierToolbar
                selectedCount={selectedIds.length}
                auditMode={auditMode}
                onEdit={() => {
                  setPanel("none");
                  setIsNotificationCenterOpen(false);
                  setIsEditDossierOpen(true);
                }}
                onAddTeam={() => {
                  setPanel("none");
                  setIsNotificationCenterOpen(false);
                  setIsAddTeamOpen(true);
                }}
              />
            </div>

            <div className="mt-3 flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 text-[12px]">
              <span className="text-muted">{t.matrix.dossier.demo.tableData}</span>
              <button type="button" className={`rounded border px-2 py-1 ${mode === "full" ? "border-primary text-primary" : "border-border text-secondary"}`} onClick={() => setMode("full")}>Full</button>
              <button type="button" className={`rounded border px-2 py-1 ${mode === "loading" ? "border-primary text-primary" : "border-border text-secondary"}`} onClick={() => setMode("loading")}>Loading</button>
              <button type="button" className={`rounded border px-2 py-1 ${mode === "empty" ? "border-primary text-primary" : "border-border text-secondary"}`} onClick={() => setMode("empty")}>Empty</button>
              <span className="text-muted sm:ml-1">{t.matrix.dossier.demo.auditWorkflow}</span>
              <button type="button" className={`rounded border px-2 py-1 ${auditMode === "standard" ? "border-primary text-primary" : "border-border text-secondary"}`} onClick={() => setAuditMode("standard")}>{t.matrix.dossier.audit.standard}</button>
              <button type="button" className={`rounded border px-2 py-1 ${auditMode === "inspection" ? "border-primary text-primary" : "border-border text-secondary"}`} onClick={() => setAuditMode("inspection")}>{t.matrix.dossier.audit.inspection}</button>
              <button type="button" className={`rounded border px-2 py-1 ${auditMode === "underReview" ? "border-primary text-primary" : "border-border text-secondary"}`} onClick={() => setAuditMode("underReview")}>{t.matrix.dossier.audit.underReview}</button>
            </div>

            <div className="mt-3 flex min-h-0 min-w-0 flex-1 flex-col">
            {showSkeleton ? (
              <div className="min-h-0 flex-1 overflow-hidden">
                <MatrixTableSkeleton />
              </div>
            ) : showEmpty ? (
              <div className="flex min-h-0 flex-1 items-center justify-center rounded-[4px] border border-border-soft">
                <p className="text-center text-[17px] text-secondary">{t.matrix.dossier.empty}</p>
              </div>
            ) : (
              <div className="relative min-h-0 flex-1">
                {auditMode === "underReview" ? (
                  <div className="pointer-events-none absolute bottom-4 left-3 z-10 flex max-w-[300px] items-start gap-2.5 rounded-[4px] bg-[#1f1f1f] px-3 py-2.5 text-[12px] leading-snug text-white shadow-lg">
                    <LockClosed16Filled className="mt-0.5 shrink-0 text-white" />
                    <span>{t.matrix.dossier.underReview.lockNotice}</span>
                  </div>
                ) : null}
                <div className="h-full min-h-0 overflow-y-auto">
                <MatrixDossierTable
                  rows={rows}
                  selectedIds={selectedIds}
                  onToggleOne={toggleOne}
                  onToggleAll={toggleAll}
                  auditMode={auditMode}
                  onOpenReviewer={(row) => {
                    setIsNotificationCenterOpen(false);
                    setActiveReviewerRow(row);
                    setPanel("reviewer");
                  }}
                />
                </div>
              </div>
            )}
            </div>
          </div>

        </div>
      </div>
      </AppMainCard>

      {panel === "activity" ? (
        <>
          <button
            type="button"
            aria-label="Close activity panel"
            className="absolute inset-0 z-20 bg-black/45"
            onClick={() => setPanel("none")}
          />
          <RightDrawerFrame widthClass={RIGHT_DRAWER_WIDTH_360} zClass="z-30">
            <ActivityTimelinePanel
              tab={activityTab}
              onTabChange={setActivityTab}
              items={activityQuery.data ?? []}
              onClose={() => setPanel("none")}
            />
          </RightDrawerFrame>
        </>
      ) : null}

      {panel === "compliance" ? (
        <>
          <button
            type="button"
            aria-label="Close compliance panel"
            className="absolute inset-0 z-20 bg-black/45"
            onClick={() => setPanel("none")}
          />
          <RightDrawerFrame widthClass={RIGHT_DRAWER_WIDTH_360} zClass="z-30">
            <ComplianceOverviewPanel chapters={complianceQuery.data ?? []} onClose={() => setPanel("none")} />
          </RightDrawerFrame>
        </>
      ) : null}

      {panel === "reviewer" && activeReviewerRow ? (
        <>
          <button
            type="button"
            aria-label="Close reviewer panel"
            className="absolute inset-0 z-[200] bg-black/45"
            onClick={() => {
              setPanel("none");
              setActiveReviewerRow(null);
            }}
          />
          <RightDrawerFrame widthClass={RIGHT_DRAWER_WIDTH_440} zClass="z-[210]">
            {contributorView ? (
              <MatrixContributorRequirementView
                key={activeReviewerRow.id}
                row={activeReviewerRow}
                onClose={() => {
                  setPanel("none");
                  setActiveReviewerRow(null);
                }}
              />
            ) : (
              <MatrixReviewerPanel
                key={activeReviewerRow.id}
                row={activeReviewerRow}
                auditMode={auditMode}
                onClose={() => {
                  setPanel("none");
                  setActiveReviewerRow(null);
                }}
              />
            )}
          </RightDrawerFrame>
        </>
      ) : null}

      {isNotificationCenterOpen ? (
        <>
          <button
            type="button"
            aria-label="Close notifications panel"
            className="absolute inset-0 z-20 bg-black/45"
            onClick={() => setIsNotificationCenterOpen(false)}
          />
          <RightDrawerFrame widthClass={RIGHT_DRAWER_WIDTH_440} zClass="z-30">
            <NotificationCenter items={notificationItems} />
          </RightDrawerFrame>
        </>
      ) : null}

      <MatrixAddTeamDialog
        open={isAddTeamOpen}
        onClose={() => setIsAddTeamOpen(false)}
        activationPreset={addTeamActivationPreset}
      />

      <MatrixFrameworkMigrationModal open={isMigrationModalOpen} onClose={() => setIsMigrationModalOpen(false)} />

      <MatrixEditDossierModal
        open={isEditDossierOpen}
        onClose={() => setIsEditDossierOpen(false)}
        defaultDossierName={editDossierDefaultName}
        defaultWorkflow={editDossierDefaultWorkflow}
        onContinue={() => {
          setIsEditDossierOpen(false);
          setIsChangeWorkflowConfirmOpen(true);
        }}
      />

      <MatrixChangeWorkflowConfirmModal
        open={isChangeWorkflowConfirmOpen}
        onClose={() => setIsChangeWorkflowConfirmOpen(false)}
        onConfirm={() => {
          setIsChangeWorkflowConfirmOpen(false);
        }}
      />
    </AppPageFrame>
  );
}
