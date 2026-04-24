"use client";

import { useState } from "react";
import { Spinner, Text } from "@fluentui/react-components";
import { useQuery } from "@tanstack/react-query";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { DashboardTopbar } from "@/features/dashboard/components/dashboard-topbar";
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";
import { DossiersTable } from "@/features/dashboard/components/dossiers-table";
import { EmptyDashboardState } from "@/features/dashboard/components/empty-dashboard-state";
import { NotificationCenter } from "@/features/dashboard/components/notification-center";
import { fetchDashboardData, notificationItems } from "@/features/dashboard/mock-data";
import type { DashboardDataMode } from "@/features/dashboard/types";
import { useDemoSession } from "@/features/auth/demo-session-context";
import { useLocale } from "@/i18n/locale-context";
import { AppPageFrame, AppMainCard } from "@/components/app-content-shell";
import { RightDrawerFrame, RIGHT_DRAWER_WIDTH_440 } from "@/components/right-drawer-frame";

function DashboardDataLoading({ label }: { label: string }) {
  return (
    <section className="flex min-h-0 flex-1 items-center justify-center border-t border-border-soft px-6">
      <div className="flex items-center gap-2 text-secondary">
        <Spinner size="tiny" />
        <span className="text-[13px]">{label}</span>
      </div>
    </section>
  );
}

export function DashboardScreen() {
  const [mode, setMode] = useState<DashboardDataMode>("full");
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const { t } = useLocale();
  const { user } = useDemoSession();
  const dashboardQuery = useQuery({
    queryKey: ["dashboard-data", mode],
    queryFn: () => fetchDashboardData(mode),
  });

  const data = dashboardQuery.data;
  const isLoading = dashboardQuery.isPending;
  const isEmpty = !isLoading && (data?.dossiers.length ?? 0) === 0;

  return (
    <AppPageFrame>
      <DashboardSidebar />
      <AppMainCard>
      <div className="flex h-full min-h-0 min-w-0 w-full flex-col overflow-hidden bg-surface">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <DashboardTopbar
            title={t.dashboard.title}
            onToggleNotifications={() =>
              setIsNotificationCenterOpen((currentValue) => !currentValue)
            }
            hasUnreadNotifications={notificationItems.some((item) => item.unread)}
          />

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="shrink-0 px-6 pb-2 pt-8">
              <Text
                as="h1"
                size={500}
                weight="semibold"
                block
                className="mb-1 text-[18px] leading-snug text-foreground"
              >
                {t.dashboard.greetingTitle.replace(
                  "{name}",
                  user?.firstName ?? data?.greetingName ?? "there",
                )}
              </Text>
              <Text size={200} className="text-[13px] leading-5 text-secondary" block>
                {t.dashboard.greetingSubtitle}
              </Text>
              <div className="mt-6">
                <DashboardStats stats={data?.stats ?? []} />
              </div>
            </div>

            {isLoading ? (
              <DashboardDataLoading label={t.dashboard.loading} />
            ) : isEmpty ? (
              <EmptyDashboardState onAction={() => setMode("full")} />
            ) : (
              <DossiersTable rows={data?.dossiers ?? []} />
            )}
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
