"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { DashboardTopbar } from "@/features/dashboard/components/dashboard-topbar";
import { NotificationCenter } from "@/features/dashboard/components/notification-center";
import { notificationItems } from "@/features/dashboard/mock-data";
import { fetchMatrixPortfolioData } from "@/features/matrix/mock-data";
import { MatrixPortfolioTable } from "@/features/matrix/components/matrix-portfolio-table";
import type { MatrixPortfolioMode } from "@/features/matrix/types";
import { useLocale } from "@/i18n/locale-context";
import { AppPageFrame, AppMainCard } from "@/components/app-content-shell";
import { RightDrawerFrame, RIGHT_DRAWER_WIDTH_440 } from "@/components/right-drawer-frame";

export function MatrixPortfolioScreen() {
  const { t } = useLocale();
  const [mode] = useState<MatrixPortfolioMode>("full");
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const query = useQuery({
    queryKey: ["matrix-portfolio", mode],
    queryFn: () => fetchMatrixPortfolioData(mode),
  });

  return (
    <AppPageFrame>
      <DashboardSidebar />
      <AppMainCard>
      <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-surface">
        <DashboardTopbar
          title={t.dashboard.nav.matrix}
          titleWeight="regular"
          onToggleNotifications={() => setIsNotificationCenterOpen((currentValue) => !currentValue)}
          hasUnreadNotifications={notificationItems.some((item) => item.unread)}
        />

        <div className="min-h-0 flex-1 overflow-hidden">
          <MatrixPortfolioTable rows={query.data?.rows ?? []} />
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
