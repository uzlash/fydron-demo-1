"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AddClientDialog } from "@/features/client-portfolio/components/add-client-dialog";
import { ClientDetailDrawer } from "@/features/client-portfolio/components/client-detail-drawer";
import { ClientPortfolioTable } from "@/features/client-portfolio/components/client-portfolio-table";
import { getClientDetail, getClientPortfolioRows } from "@/features/client-portfolio/mock-data";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { DashboardTopbar } from "@/features/dashboard/components/dashboard-topbar";
import { NotificationCenter } from "@/features/dashboard/components/notification-center";
import { notificationItems } from "@/features/dashboard/mock-data";
import { useLocale } from "@/i18n/locale-context";
import { AppPageFrame, AppMainCard } from "@/components/app-content-shell";
import { RightDrawerFrame, RIGHT_DRAWER_WIDTH_440 } from "@/components/right-drawer-frame";

export function ClientPortfolioScreen() {
  const { t } = useLocale();
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [drawerClientId, setDrawerClientId] = useState<string | null>(null);

  const dataQuery = useQuery({
    queryKey: ["client-portfolio", "list"],
    queryFn: () => getClientPortfolioRows(),
  });

  const detail = useMemo(
    () => (drawerClientId ? getClientDetail(drawerClientId) : null),
    [drawerClientId],
  );

  return (
    <AppPageFrame>
      <DashboardSidebar />
      <AppMainCard>
      <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-surface">
        <DashboardTopbar
          title={t.dashboard.nav.clientPortfolio}
          onToggleNotifications={() => setIsNotificationCenterOpen((v) => !v)}
          hasUnreadNotifications={notificationItems.some((item) => item.unread)}
        />

        <div className="min-h-0 flex-1 overflow-hidden">
          <ClientPortfolioTable
            rows={dataQuery.data ?? []}
            onSelectClient={(id) => setDrawerClientId(id)}
            onOpenAddClient={() => setIsAddClientOpen(true)}
          />
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

      <AddClientDialog open={isAddClientOpen} onClose={() => setIsAddClientOpen(false)} />
      <ClientDetailDrawer
        open={drawerClientId !== null}
        detail={detail}
        onClose={() => setDrawerClientId(null)}
      />
    </AppPageFrame>
  );
}
