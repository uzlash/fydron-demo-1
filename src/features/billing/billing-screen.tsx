"use client";

import { useState } from "react";
import { Spinner, Text } from "@fluentui/react-components";
import {
  ArrowSync16Regular,
  ArrowDownload16Regular,
  CheckmarkCircle16Filled,
  DiamondDismiss16Filled,
} from "@fluentui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { DashboardTopbar } from "@/features/dashboard/components/dashboard-topbar";
import { NotificationCenter } from "@/features/dashboard/components/notification-center";
import { notificationItems } from "@/features/dashboard/mock-data";
import { useLocale } from "@/i18n/locale-context";
import { AppPageFrame, AppMainCard } from "@/components/app-content-shell";
import { RightDrawerFrame, RIGHT_DRAWER_WIDTH_440 } from "@/components/right-drawer-frame";
import { fetchBillingData } from "@/features/billing/mock-data";
import type { InvoiceStatus } from "@/features/billing/types";

function StatusBadge({
  status,
  label,
}: {
  status: InvoiceStatus;
  label: string;
}) {
  if (status === "success") {
    return (
      <span className="inline-flex items-center gap-2 text-[13px] text-foreground">
        <CheckmarkCircle16Filled className="shrink-0 text-success" />
        {label}
      </span>
    );
  }

  if (status === "failed") {
    return (
      <span className="inline-flex items-center gap-2 text-[13px] text-foreground">
        <DiamondDismiss16Filled className="shrink-0 text-danger" />
        {label}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 text-[13px] text-foreground">
      <ArrowSync16Regular className="shrink-0 text-muted" />
      {label}
    </span>
  );
}

function InvoiceEmptyState({ label }: { label: string }) {
  return (
    <div className="flex min-h-[320px] items-center justify-center bg-surface px-6 py-16 text-[13px] text-secondary">
      {label}
    </div>
  );
}

export function BillingScreen() {
  const { t } = useLocale();
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [invoicePage, setInvoicePage] = useState(2);
  const billingQuery = useQuery({
    queryKey: ["billing-data"],
    queryFn: fetchBillingData,
  });

  const data = billingQuery.data;
  const isLoading = billingQuery.isPending;
  const overview = data?.overview;

  return (
    <AppPageFrame>
      <DashboardSidebar />
      <AppMainCard>
        <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden">
          <DashboardTopbar
            title={t.billing.title}
            onToggleNotifications={() => setIsNotificationCenterOpen((current) => !current)}
            hasUnreadNotifications={notificationItems.some((item) => item.unread)}
          />

          {isLoading ? (
            <section className="flex min-h-0 flex-1 items-center justify-center border-t border-border-soft px-6">
              <div className="flex items-center gap-2 text-secondary">
                <Spinner size="tiny" />
                <span className="text-[13px]">{t.billing.loading}</span>
              </div>
            </section>
          ) : (
            <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="shrink-0 flex flex-col px-6 pb-0 pt-6">
                <Text block size={500} weight="semibold" className="text-[18px] leading-tight text-foreground">
                  {t.billing.overview.title}
                </Text>
                <Text block size={200} className="mt-1 text-[13px] leading-5 text-secondary">
                  {t.billing.overview.subtitle}
                </Text>

                <div className="mt-6 w-full max-w-[640px] overflow-hidden rounded-[4px] border border-border bg-surface shadow-none">
                  <div className="flex min-h-0 min-w-0 flex-col sm:min-h-[168px] sm:flex-row sm:items-stretch">
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 border-b border-border px-6 py-6 sm:border-b-0 sm:border-r sm:py-6">
                      <div className="flex flex-col">
                        <Text block weight="semibold" className="text-[16px] leading-tight text-foreground">
                          {overview?.suiteName}
                        </Text>
                        <Text
                          block
                          className={
                            overview?.isActive
                              ? "mt-2 text-[13px] leading-5 text-fydron-active"
                              : "mt-2 text-[13px] leading-5 text-secondary"
                          }
                        >
                          {overview?.statusLabel}
                        </Text>
                      </div>
                      <button
                        type="button"
                        disabled={!overview?.isActive}
                        className={`inline-flex h-8 w-fit shrink-0 items-center justify-center rounded-[4px] border border-border-strong px-4 text-[13px] font-medium ${
                          overview?.isActive
                            ? "text-secondary transition-colors hover:bg-surface-muted"
                            : "cursor-not-allowed border-border text-muted opacity-60"
                        }`}
                      >
                        {t.billing.overview.contactCta}
                      </button>
                    </div>
                    <div className="flex w-full flex-col justify-center gap-6 px-6 py-6 sm:w-[240px] sm:shrink-0">
                      <p className="m-0 text-[0] leading-none">
                        <span className="text-[13px] font-semibold leading-snug tabular-nums text-foreground">
                          {overview?.activeClients}
                        </span>{" "}
                        <span className="text-[13px] leading-snug text-secondary">{t.billing.overview.activeClients}</span>
                      </p>
                      <p className="m-0 text-[0] leading-none">
                        <span className="text-[13px] font-semibold leading-snug tabular-nums text-foreground">
                          {overview?.activeDossiers}
                        </span>{" "}
                        <span className="text-[13px] leading-snug text-secondary">{t.billing.overview.activeDossiers}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <section className="mt-8 flex min-h-0 flex-1 flex-col">
                <div className="shrink-0 flex flex-col px-6">
                  <Text block size={500} weight="semibold" className="text-[18px] leading-tight text-foreground">
                    {t.billing.invoices.title}
                  </Text>
                  <Text block size={200} className="mt-1 text-[13px] leading-5 text-secondary">
                    {t.billing.invoices.subtitle}
                  </Text>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
                      <thead className="sticky top-0 z-10 border-b border-border bg-surface text-left text-[12px] font-medium text-secondary">
                        <tr>
                          <th className="w-[20%] py-3 pl-3 pr-2 text-left">
                            <span className="inline-flex items-center gap-1">
                              {t.billing.invoices.columns.invoice}
                              <span className="text-[10px] font-normal opacity-80">↕</span>
                            </span>
                          </th>
                          <th className="w-[20%] px-2 py-3 text-left">
                            <span className="inline-flex items-center gap-1">
                              {t.billing.invoices.columns.status}
                              <span className="text-[10px] font-normal opacity-80">↕</span>
                            </span>
                          </th>
                          <th className="w-[18%] px-2 py-3 text-left">{t.billing.invoices.columns.date}</th>
                          <th className="w-[16%] px-2 py-3 text-left tabular-nums">
                            {t.billing.invoices.columns.amount}
                          </th>
                          <th className="w-[26%] py-3 pl-2 pr-3 text-right">
                            <span className="sr-only">{t.billing.invoices.download}</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-soft">
                        {(data?.invoices.length ?? 0) > 0 ? (
                          data?.invoices.map((row) => (
                            <tr key={row.id} className="bg-surface transition-colors hover:bg-surface-muted/60">
                              <td className="py-4 pl-3 pr-2 font-medium text-foreground">{row.invoiceNumber}</td>
                              <td className="px-2 py-4">
                                <StatusBadge
                                  status={row.status}
                                  label={t.billing.invoices.statusLabels[row.status]}
                                />
                              </td>
                              <td className="px-2 py-4 tabular-nums text-secondary">{row.date}</td>
                              <td className="px-2 py-4 text-left tabular-nums text-foreground">{row.amount}</td>
                              <td className="py-4 pl-2 pr-3 text-right">
                                <button
                                  type="button"
                                  className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-border-strong px-3 text-[13px] font-medium text-secondary transition-colors hover:bg-surface-muted"
                                >
                                  <ArrowDownload16Regular className="text-secondary" />
                                  {t.billing.invoices.download}
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="p-0">
                              <InvoiceEmptyState label={t.billing.invoices.empty} />
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {(data?.invoices.length ?? 0) > 0 ? (
                  <div className="mt-auto flex shrink-0 items-center justify-end gap-0.5 border-t border-border-soft px-6 py-4 text-[13px] text-foreground">
                    <button
                      type="button"
                      onClick={() => setInvoicePage((p) => Math.max(1, p - 1))}
                      className="mr-1 flex items-center gap-1 rounded px-2 py-1.5 font-medium transition-colors hover:bg-surface-muted"
                    >
                      <span className="text-[16px] leading-none">‹</span> {t.dashboard.pagination.previous}
                    </button>
                    {[1, 2, 3].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setInvoicePage(n)}
                        className={
                          invoicePage === n
                            ? "flex h-8 w-8 items-center justify-center rounded border border-border-strong text-[13px] font-semibold text-foreground"
                            : "flex h-8 w-8 items-center justify-center rounded text-[13px] font-medium text-secondary transition-colors hover:bg-surface-muted"
                        }
                      >
                        {n}
                      </button>
                    ))}
                    <span className="px-1.5 text-secondary">…</span>
                    <button
                      type="button"
                      onClick={() => setInvoicePage((p) => Math.min(10, p + 1))}
                      className="ml-1 flex items-center gap-1 rounded px-2 py-1.5 font-medium transition-colors hover:bg-surface-muted"
                    >
                      {t.dashboard.pagination.next} <span className="text-[16px] leading-none">›</span>
                    </button>
                  </div>
                ) : null}
              </section>
            </main>
          )}
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
