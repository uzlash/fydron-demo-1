"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Text } from "@fluentui/react-components";
import { useLocale } from "@/i18n/locale-context";
import { getClientProfile } from "@/features/client-portfolio/mock-data";
import type { ClientProfileTab } from "@/features/client-portfolio/types";
import { ClientProfileHeader } from "@/features/client-portfolio/components/client-profile-header";
import { EditClientDialog } from "@/features/client-portfolio/components/edit-client-dialog";
import {
  ClientProfileDossiersPanel,
  ClientProfileOverviewPanel,
  ClientProfileSettingsPanel,
  ClientProfileUsersPanel,
} from "@/features/client-portfolio/components/client-profile-tab-panels";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { DashboardTopbar } from "@/features/dashboard/components/dashboard-topbar";
import { NotificationCenter } from "@/features/dashboard/components/notification-center";
import { notificationItems } from "@/features/dashboard/mock-data";
import { AppPageFrame, AppMainCard } from "@/components/app-content-shell";
import { RightDrawerFrame, RIGHT_DRAWER_WIDTH_440 } from "@/components/right-drawer-frame";

type ClientProfileScreenProps = {
  clientId: string;
};

export function ClientProfileScreen({ clientId }: ClientProfileScreenProps) {
  const { t } = useLocale();
  const router = useRouter();
  const p = t.clientPortfolio.profile;
  const [tab, setTab] = useState<ClientProfileTab>("overview");
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);

  const tabItems: { id: ClientProfileTab; label: string }[] = [
    { id: "overview", label: p.tabs.overview },
    { id: "users", label: p.tabs.users },
    { id: "dossiers", label: p.tabs.dossiers },
    { id: "settings", label: p.tabs.settings },
  ];

  const profile = useMemo(() => getClientProfile(clientId), [clientId]);

  return (
    <AppPageFrame>
      <DashboardSidebar />
      <AppMainCard>
      <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-surface">
        <DashboardTopbar
          title={p.pageTitle}
          onToggleNotifications={() => setIsNotificationCenterOpen((v) => !v)}
          hasUnreadNotifications={notificationItems.some((item) => item.unread)}
        />

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-0 pt-4 sm:px-10 sm:pt-5">
          {!profile ? (
            <div className="shrink-0 p-4">
              <Text className="text-[15px] text-foreground">{p.notFound}</Text>
              <Button appearance="primary" className="mt-4" onClick={() => router.push("/client-portfolio")}>
                {p.backToPortfolio}
              </Button>
            </div>
          ) : (
            <>
              <div className="shrink-0">
                <ClientProfileHeader profile={profile} onEdit={() => setIsEditClientOpen(true)} />
                <div className="mt-4 border-b border-border-soft">
                  <div className="flex flex-wrap gap-6">
                    {tabItems.map((item) => {
                      const isActive = tab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setTab(item.id)}
                          className={
                            isActive
                              ? "border-b-2 border-primary pb-2.5 text-[14px] font-medium text-foreground"
                              : "border-b-2 border-transparent pb-2.5 text-[14px] text-secondary hover:text-foreground"
                          }
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto pb-8 pt-4">
                {tab === "overview" ? <ClientProfileOverviewPanel profile={profile} /> : null}
                {tab === "users" ? <ClientProfileUsersPanel users={profile.users} /> : null}
                {tab === "dossiers" ? <ClientProfileDossiersPanel profile={profile} /> : null}
                {tab === "settings" ? (
                  <ClientProfileSettingsPanel onDeactivateSuccess={() => router.push("/client-portfolio")} />
                ) : null}
              </div>

              <EditClientDialog
                open={isEditClientOpen}
                onClose={() => setIsEditClientOpen(false)}
                profile={profile}
              />
            </>
          )}
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
