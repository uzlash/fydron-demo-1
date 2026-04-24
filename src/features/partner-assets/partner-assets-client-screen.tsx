"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Button, Input, Text } from "@fluentui/react-components";
import {
  ArrowUpload20Regular,
  DiamondDismiss20Filled,
  Filter20Regular,
  Money20Regular,
  Link20Regular,
  Search20Regular,
  Warning16Filled,
} from "@fluentui/react-icons";
import { AppMainCard, AppPageFrame } from "@/components/app-content-shell";
import { PartnerAssetDocStatusCell } from "@/features/partner-assets/components/partner-asset-doc-status-cell";
import { PartnerAssetsPagination } from "@/features/partner-assets/components/partner-assets-pagination";
import { getPartnerAssetDocumentsForOrg, getPartnerOrganisationById } from "@/features/partner-assets/mock-data";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { DashboardTopbar } from "@/features/dashboard/components/dashboard-topbar";
import { NotificationCenter } from "@/features/dashboard/components/notification-center";
import { notificationItems } from "@/features/dashboard/mock-data";
import { useLocale } from "@/i18n/locale-context";
import { RightDrawerFrame, RIGHT_DRAWER_WIDTH_440 } from "@/components/right-drawer-frame";

const DUMMY_TOTAL_PAGES = 3;

export function PartnerAssetsClientScreen() {
  const { t } = useLocale();
  const d = t.partnerAssets.detail;
  const params = useParams();
  const orgId = typeof params.orgId === "string" ? params.orgId : "";
  const org = orgId ? getPartnerOrganisationById(orgId) : undefined;

  const [docSearch, setDocSearch] = useState("");
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  const allDocs = useMemo(
    () => (org ? getPartnerAssetDocumentsForOrg(org.id) : []),
    [org],
  );

  const filteredDocs = useMemo(() => {
    const q = docSearch.trim().toLowerCase();
    if (!q) {
      return allDocs;
    }
    return allDocs.filter((row) => row.name.toLowerCase().includes(q));
  }, [allDocs, docSearch]);

  const pageRows = filteredDocs;

  if (!org) {
    notFound();
  }

  return (
    <AppPageFrame>
      <DashboardSidebar />
      <AppMainCard>
        <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-surface">
          <DashboardTopbar
            title={t.dashboard.nav.partnerAssets}
            onToggleNotifications={() => setIsNotificationCenterOpen((v) => !v)}
            hasUnreadNotifications={notificationItems.some((item) => item.unread)}
          />

          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 pt-5">
            <nav className="flex flex-wrap items-center gap-1.5 text-[13px] text-secondary">
              <Link href="/partner-assets" className="hover:text-foreground hover:underline">
                {d.breadcrumbModule}
              </Link>
              <span aria-hidden="true" className="text-muted">
                ›
              </span>
              <Link href="/partner-assets" className="hover:text-foreground hover:underline">
                {d.breadcrumbClients}
              </Link>
              <span aria-hidden="true" className="text-muted">
                ›
              </span>
              <span className="font-medium text-foreground">{org.name}</span>
            </nav>

            <Text as="h1" size={600} weight="semibold" className="mt-3 text-[28px] leading-tight tracking-tight text-foreground">
              {org.name}
            </Text>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <Input
                className="h-9 w-full min-w-0 max-w-[420px] rounded border-border"
                value={docSearch}
                onChange={(_, data) => {
                  setDocSearch(data.value);
                }}
                placeholder={d.searchDocumentsPlaceholder}
                contentBefore={
                  <span className="pl-1 text-muted">
                    <Search20Regular className="h-4 w-4" />
                  </span>
                }
              />
              <div className="flex min-w-0 flex-wrap items-center gap-2 sm:shrink-0">
                <Button
                  appearance="outline"
                  className="h-9 rounded border-border-strong text-[13px] text-secondary"
                  icon={<Filter20Regular className="h-4 w-4 text-secondary" />}
                >
                  {d.status}
                </Button>
                <Button
                  appearance="primary"
                  className="h-9 rounded text-[13px]"
                  icon={<ArrowUpload20Regular className="h-4 w-4" />}
                >
                  {d.upload}
                </Button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="flex items-start gap-3 rounded-lg border border-border bg-surface px-4 py-4 shadow-sm">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Money20Regular className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[13px] text-secondary">{d.cards.totalAssets}</p>
                  <p className="text-[24px] font-semibold leading-tight tabular-nums text-foreground">0</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border bg-surface px-4 py-4 shadow-sm">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-success/10 text-success">
                  <Link20Regular className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[13px] text-secondary">{d.cards.activeLinks}</p>
                  <p className="text-[24px] font-semibold leading-tight tabular-nums text-foreground">0</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border bg-surface px-4 py-4 shadow-sm">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#ca5010]/10 text-[#ca5010]">
                  <Warning16Filled className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[13px] text-secondary">{d.cards.expiringSoon}</p>
                  <p className="text-[24px] font-semibold leading-tight tabular-nums text-foreground">0</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border bg-surface px-4 py-4 shadow-sm">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-danger/10 text-danger">
                  <DiamondDismiss20Filled className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[13px] text-secondary">{d.cards.expired}</p>
                  <p className="text-[24px] font-semibold leading-tight tabular-nums text-foreground">0</p>
                </div>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface shadow-sm">
              <table className="w-full min-w-[720px] border-collapse text-[13px]">
                <thead className="border-b border-border-soft bg-surface text-left text-[13px] font-medium text-secondary">
                  <tr>
                    <th className="px-4 py-3 font-medium">{d.table.documentName}</th>
                    <th className="w-[100px] px-4 py-3 font-medium">{d.table.type}</th>
                    <th className="w-[100px] px-4 py-3 font-medium">{d.table.version}</th>
                    <th className="w-[100px] px-4 py-3 font-medium">{d.table.size}</th>
                    <th className="w-[120px] px-4 py-3 font-medium">{d.table.validUntil}</th>
                    <th className="w-[180px] px-4 py-3 font-medium">{d.table.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((row) => (
                    <tr key={row.id} className="border-b border-border-soft last:border-b-0">
                      <td className="px-4 py-3 text-[14px] font-medium text-foreground">{row.name}</td>
                      <td className="px-4 py-3 text-[13px] text-secondary">{row.type}</td>
                      <td className="px-4 py-3 text-[13px] tabular-nums text-secondary">{row.version}</td>
                      <td className="px-4 py-3 text-[13px] text-secondary">{row.size}</td>
                      <td className="px-4 py-3 text-[13px] text-secondary">{row.validUntilLabel}</td>
                      <td className="px-4 py-3">
                        <PartnerAssetDocStatusCell status={row.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 border-t border-border-soft pt-3">
              <PartnerAssetsPagination
                totalPages={DUMMY_TOTAL_PAGES}
                currentPage={1}
                onPageChange={() => undefined}
                previousLabel={d.pagination.previous}
                nextLabel={d.pagination.next}
              />
            </div>
          </div>
        </div>
      </AppMainCard>

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
    </AppPageFrame>
  );
}
