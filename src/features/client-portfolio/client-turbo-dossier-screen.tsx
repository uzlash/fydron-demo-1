"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, Text } from "@fluentui/react-components";
import { Edit16Regular, Eye20Regular } from "@fluentui/react-icons";
import { ActivityTimelinePanel } from "@/features/matrix/components/activity-timeline-panel";
import { ComplianceOverviewPanel } from "@/features/matrix/components/compliance-overview-panel";
import { MatrixDossierTable } from "@/features/matrix/components/matrix-dossier-table";
import { ClientPortfolioDossierDrawer } from "@/features/client-portfolio/components/client-portfolio-dossier-drawer";
import { fetchMatrixActivityItems, fetchMatrixComplianceChapters } from "@/features/matrix/mock-data";
import type { MatrixActivityTab, MatrixDossierRow } from "@/features/matrix/types";
import { getClientTurboDossierData } from "@/features/client-portfolio/mock-data";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { DashboardTopbar } from "@/features/dashboard/components/dashboard-topbar";
import { NotificationCenter } from "@/features/dashboard/components/notification-center";
import { notificationItems } from "@/features/dashboard/mock-data";
import { useLocale } from "@/i18n/locale-context";
import { AppPageFrame, AppMainCard } from "@/components/app-content-shell";
import { RightDrawerFrame, RIGHT_DRAWER_WIDTH_360, RIGHT_DRAWER_WIDTH_440 } from "@/components/right-drawer-frame";

const PAGE_SIZE = 4;

type ClientTurboDossierScreenProps = {
  clientId: string;
  dossierId: string;
};

type SidePanel = "none" | "reviewer" | "activity" | "compliance";

export function ClientTurboDossierScreen({ clientId, dossierId }: ClientTurboDossierScreenProps) {
  const { t } = useLocale();
  const router = useRouter();
  const md = t.matrix.dossier;
  const turbo = t.clientPortfolio.turboDossier;
  const nav = t.dashboard.nav;
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [sidePanel, setSidePanel] = useState<SidePanel>("none");
  const [activeReviewerRow, setActiveReviewerRow] = useState<MatrixDossierRow | null>(null);
  const [activityTab, setActivityTab] = useState<MatrixActivityTab>("all");

  const data = useMemo(() => getClientTurboDossierData(clientId, dossierId), [clientId, dossierId]);

  const activityQuery = useQuery({
    queryKey: ["matrix-activity", "client-turbo", clientId, dossierId],
    queryFn: fetchMatrixActivityItems,
    enabled: Boolean(data),
  });
  const complianceQuery = useQuery({
    queryKey: ["matrix-compliance", "client-turbo", clientId, dossierId],
    queryFn: fetchMatrixComplianceChapters,
    enabled: Boolean(data),
  });

  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
    setSidePanel("none");
    setActiveReviewerRow(null);
  }, [clientId, dossierId]);

  const { totalPages, safePage, pageRows } = useMemo(() => {
    if (!data) {
      return { totalPages: 1, safePage: 1, pageRows: [] as MatrixDossierRow[] };
    }
    const total = Math.max(1, Math.ceil(data.rows.length / PAGE_SIZE));
    const sp = Math.min(page, total);
    const start = (sp - 1) * PAGE_SIZE;
    return {
      totalPages: total,
      safePage: sp,
      pageRows: data.rows.slice(start, start + PAGE_SIZE),
    };
  }, [data, page]);

  const allSelected = pageRows.length > 0 && pageRows.every((r) => selectedIds.includes(r.id));

  const openReviewer = (row: MatrixDossierRow) => {
    setIsNotificationCenterOpen(false);
    setSidePanel("reviewer");
    setActiveReviewerRow(row);
  };

  const closePanels = () => {
    setSidePanel("none");
    setActiveReviewerRow(null);
  };

  const toggleAll = () => {
    if (!pageRows.length) return;
    if (allSelected) {
      setSelectedIds((ids) => ids.filter((id) => !pageRows.some((r) => r.id === id)));
    } else {
      setSelectedIds((ids) => {
        const next = new Set(ids);
        pageRows.forEach((r) => next.add(r.id));
        return [...next];
      });
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  };

  if (!data) {
    return (
      <AppPageFrame>
        <DashboardSidebar />
        <AppMainCard>
        <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-surface p-6">
          <Text>{t.clientPortfolio.profile.notFound}</Text>
          <Button appearance="primary" className="mt-4" onClick={() => router.push("/client-portfolio")}>
            {t.clientPortfolio.profile.backToPortfolio}
          </Button>
        </div>
        </AppMainCard>
      </AppPageFrame>
    );
  }

  const pageTitle = turbo.pageTitle
    .replace("{framework}", data.frameworkTitle)
    .replace("{site}", data.siteName);

  return (
    <AppPageFrame>
      <DashboardSidebar />
      <AppMainCard>
      <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-surface">
        <DashboardTopbar
          title={nav.matrix}
          onToggleNotifications={() => {
            closePanels();
            setIsNotificationCenterOpen((v) => !v);
          }}
          hasUnreadNotifications={notificationItems.some((item) => item.unread)}
        />

        <div className="relative flex min-h-0 min-w-0 flex-1">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 py-4 sm:px-5">
            <nav className="shrink-0 text-[12px] text-muted" aria-label="Breadcrumb">
              <Link className="hover:text-foreground" href="/matrix">
                {turbo.breadcrumbMatrix}
              </Link>
              <span> &gt; </span>
              <Link className="hover:text-foreground" href="/client-portfolio">
                {turbo.breadcrumbClientPortfolio}
              </Link>
              <span> &gt; </span>
              <span className="text-secondary">
                {turbo.breadcrumbDossierPrefix} {data.frameworkTitle}
              </span>
            </nav>

            <div className="mt-3 flex shrink-0 flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-start">
              <div className="min-w-0">
                <h1 className="text-[24px] font-semibold leading-tight text-foreground sm:text-[28px] lg:text-[32px]">
                  {pageTitle}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-secondary">
                  <span className="inline-flex rounded-[3px] bg-surface-muted px-2 py-1">
                    {md.frameworkVersion}: {data.frameworkVersion}
                  </span>
                  <button
                    type="button"
                    className={`inline-flex rounded-[3px] px-2 py-1 ${
                      data.overallCompliance >= 100 ? "bg-[#e8f7ee] font-medium text-[#0b5c2e]" : "bg-surface-muted"
                    }`}
                    onClick={() => {
                      setIsNotificationCenterOpen(false);
                      setSidePanel("compliance");
                      setActiveReviewerRow(null);
                    }}
                  >
                    {md.overallCompliance}: {data.overallCompliance}%
                  </button>
                  <button
                    type="button"
                    className="inline-flex rounded-[3px] bg-surface-muted px-2 py-1"
                    onClick={() => {
                      setIsNotificationCenterOpen(false);
                      setSidePanel("activity");
                      setActiveReviewerRow(null);
                    }}
                  >
                    {md.lastSynced}: {data.lastSynced}
                  </button>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                <Button
                  appearance="outline"
                  disabled
                  className="h-9 !border-border-soft !bg-surface-muted !text-secondary"
                  icon={<Edit16Regular className="h-4 w-4" />}
                >
                  {turbo.actions.edit}
                </Button>
                <Button appearance="outline" className="h-9 border-border text-foreground">
                  {turbo.actions.readyForReview}
                </Button>
                <Button
                  appearance="primary"
                  className="h-9 font-medium"
                  icon={<Eye20Regular className="h-4 w-4" />}
                  onClick={() => {
                    closePanels();
                    setActiveReviewerRow(null);
                    setSidePanel("none");
                    setIsNotificationCenterOpen(false);
                    router.push(`/client-portfolio/${clientId}/dossier/${dossierId}/auditor-turbo-view`);
                  }}
                >
                  {turbo.actions.auditorTurboView}
                </Button>
              </div>
            </div>

            <div className="mt-3 flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto">
                <MatrixDossierTable
                  showLastUpdated={false}
                  rows={pageRows}
                  selectedIds={selectedIds}
                  onToggleOne={toggleOne}
                  onToggleAll={toggleAll}
                  onOpenReviewer={openReviewer}
                />
              </div>

              <div className="mt-4 flex shrink-0 items-center justify-end gap-1 border-t border-border-soft pt-3 text-[13px] text-secondary sm:gap-2">
              <button
                type="button"
                className="px-2 py-1 hover:text-foreground disabled:opacity-40"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                {turbo.pagination.previous}
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`h-7 min-w-7 rounded px-1.5 ${
                    n === safePage ? "border border-border bg-surface-muted text-foreground" : "hover:bg-surface-muted"
                  }`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                className="px-2 py-1 hover:text-foreground disabled:opacity-40"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                {turbo.pagination.next}
              </button>
              </div>
            </div>
          </div>

          {sidePanel === "activity" ? (
            <>
              <button
                type="button"
                aria-label="Close activity panel"
                className="fixed inset-0 z-[100] bg-black/45"
                onClick={closePanels}
              />
              <RightDrawerFrame widthClass={RIGHT_DRAWER_WIDTH_360} position="fixed" zClass="z-[110]">
                <ActivityTimelinePanel
                  tab={activityTab}
                  onTabChange={setActivityTab}
                  items={activityQuery.data ?? []}
                  onClose={closePanels}
                />
              </RightDrawerFrame>
            </>
          ) : null}

          {sidePanel === "compliance" ? (
            <>
              <button
                type="button"
                aria-label="Close compliance panel"
                className="fixed inset-0 z-[100] bg-black/45"
                onClick={closePanels}
              />
              <RightDrawerFrame widthClass={RIGHT_DRAWER_WIDTH_360} position="fixed" zClass="z-[110]">
                <ComplianceOverviewPanel chapters={complianceQuery.data ?? []} onClose={closePanels} />
              </RightDrawerFrame>
            </>
          ) : null}

          {sidePanel === "reviewer" && activeReviewerRow ? (
            <>
              <button
                type="button"
                aria-label="Close reviewer panel"
                className="fixed inset-0 z-[100] bg-black/45"
                onClick={closePanels}
              />
              <RightDrawerFrame widthClass={RIGHT_DRAWER_WIDTH_440} position="fixed" zClass="z-[110]">
                <ClientPortfolioDossierDrawer
                  row={activeReviewerRow}
                  onClose={closePanels}
                  onViewInTurboView={() => {
                    closePanels();
                    router.push(
                      `/client-portfolio/${clientId}/dossier/${dossierId}/auditor-turbo-view?rowId=${encodeURIComponent(activeReviewerRow.id)}`
                    );
                  }}
                />
              </RightDrawerFrame>
            </>
          ) : null}
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
