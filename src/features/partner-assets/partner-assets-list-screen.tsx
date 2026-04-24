"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Text } from "@fluentui/react-components";
import { Search20Regular } from "@fluentui/react-icons";
import { AppMainCard, AppPageFrame } from "@/components/app-content-shell";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { DashboardTopbar } from "@/features/dashboard/components/dashboard-topbar";
import { NotificationCenter } from "@/features/dashboard/components/notification-center";
import { notificationItems } from "@/features/dashboard/mock-data";
import { PartnerAssetsPagination } from "@/features/partner-assets/components/partner-assets-pagination";
import { PARTNER_ORGANISATIONS } from "@/features/partner-assets/mock-data";
import { useLocale } from "@/i18n/locale-context";
import { RightDrawerFrame, RIGHT_DRAWER_WIDTH_440 } from "@/components/right-drawer-frame";

const DUMMY_TOTAL_PAGES = 3;

function compareOrgName(a: { name: string }, b: { name: string }, asc: boolean) {
  const c = a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  return asc ? c : -c;
}

export function PartnerAssetsListScreen() {
  const { t } = useLocale();
  const router = useRouter();
  const p = t.partnerAssets.list;
  const [search, setSearch] = useState("");
  const [orgSortAsc, setOrgSortAsc] = useState(true);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  const filteredSorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = !q
      ? [...PARTNER_ORGANISATIONS]
      : PARTNER_ORGANISATIONS.filter((o) => o.name.toLowerCase().includes(q));
    list.sort((a, b) => compareOrgName(a, b, orgSortAsc));
    return list;
  }, [search, orgSortAsc]);

  const pageRows = filteredSorted;

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

          <section className="flex min-h-0 flex-1 flex-col border-t border-border-soft bg-surface">
            <div className="shrink-0 px-6 pt-8">
              <Text as="h2" size={500} weight="semibold" className="text-[18px] leading-tight text-foreground">
                {p.clientsHeading}
              </Text>
            </div>

            <div className="shrink-0 px-6 pt-5">
              <Input
                className="h-9 w-full min-w-0 max-w-[420px] rounded border-border"
                value={search}
                onChange={(_, data) => {
                  setSearch(data.value);
                }}
                placeholder={p.searchPlaceholder}
                contentBefore={
                  <span className="pl-1 text-muted">
                    <Search20Regular className="h-4 w-4" />
                  </span>
                }
              />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-2">
              <div className="w-full min-w-0">
                <table className="w-full border-collapse text-[13px]">
                  <thead className="text-left text-[13px] font-medium tracking-tight text-secondary">
                    <tr className="border-b border-border-soft">
                      <th className="w-full py-3 pl-0 pr-1">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 font-medium text-secondary hover:text-foreground"
                          onClick={() => {
                            setOrgSortAsc((a) => !a);
                                    }}
                        >
                          {p.table.organisation}{" "}
                          <span className="text-[10px] font-normal opacity-80">↕</span>
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((row) => (
                      <tr
                        key={row.id}
                        className="cursor-pointer border-b border-border-soft text-foreground last:border-b-0 hover:bg-surface-muted"
                        onClick={() => router.push(`/partner-assets/${row.id}`)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            router.push(`/partner-assets/${row.id}`);
                          }
                        }}
                        tabIndex={0}
                        role="link"
                      >
                        <td className="py-3 pl-0 pr-3 text-[14px] font-medium">{row.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="shrink-0 border-t border-border-soft px-6 py-3">
              <PartnerAssetsPagination
                totalPages={DUMMY_TOTAL_PAGES}
                currentPage={1}
                onPageChange={() => undefined}
                previousLabel={p.pagination.previous}
                nextLabel={p.pagination.next}
              />
            </div>
          </section>
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
