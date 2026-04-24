"use client";

import { Button, Card, Text } from "@fluentui/react-components";
import { ArrowUpRight20Regular, Mail20Regular } from "@fluentui/react-icons";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { DashboardTopbar } from "@/features/dashboard/components/dashboard-topbar";
import { NotificationCenter } from "@/features/dashboard/components/notification-center";
import { notificationItems } from "@/features/dashboard/mock-data";
import { useLocale } from "@/i18n/locale-context";
import { useState } from "react";
import { AppPageFrame, AppMainCard } from "@/components/app-content-shell";
import { RightDrawerFrame, RIGHT_DRAWER_WIDTH_440 } from "@/components/right-drawer-frame";

export function SupportSettingsScreen() {
  const { t } = useLocale();
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  return (
    <AppPageFrame>
      <DashboardSidebar />
      <AppMainCard>
      <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-surface">
        <DashboardTopbar
          title={t.settings.title}
          onToggleNotifications={() => setIsNotificationCenterOpen((value) => !value)}
          hasUnreadNotifications={notificationItems.some((item) => item.unread)}
        />

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          <div className="rounded-[12px] border border-border bg-surface">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border-soft px-5 py-5">
              <div className="flex flex-col">
                <Text size={600} weight="semibold" className="block text-[28px] leading-none text-foreground">
                  {t.settings.support.title}
                </Text>
                <Text size={300} className="mt-2 block text-[15px] text-secondary">
                  {t.settings.support.subtitle}
                </Text>
              </div>

              <Button
                appearance="primary"
                icon={<ArrowUpRight20Regular />}
                iconPosition="before"
                className="h-10 rounded-[4px] px-4 text-[14px] font-semibold"
              >
                {t.settings.support.helpCenter}
              </Button>
            </div>

            <div className="px-5 py-7">
              <Card
                appearance="outline"
                className="w-full max-w-[250px] rounded-md border border-border bg-surface p-4 shadow-none"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center text-secondary">
                  <Mail20Regular />
                </span>
                <Text weight="semibold" className="mt-2 block text-[15px] text-foreground">
                  {t.settings.support.emailTitle}
                </Text>
                <Text size={200} className="mt-1 block text-[14px] text-secondary">
                  {t.settings.support.emailSubtitle}
                </Text>

                <Button appearance="outline" className="mt-6 h-8 w-fit rounded border-border-strong px-3 text-[13px] font-medium text-foreground">
                  {t.settings.support.sendEmail}
                </Button>
              </Card>
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
