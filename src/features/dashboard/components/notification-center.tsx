"use client";

import { useMemo, useState } from "react";
import { Text } from "@fluentui/react-components";
import type { NotificationItem, NotificationTab } from "@/features/dashboard/types";
import { useLocale } from "@/i18n/locale-context";

type NotificationCenterProps = {
  items: NotificationItem[];
};

function groupByDay(items: NotificationItem[]) {
  return items.reduce<Record<string, NotificationItem[]>>((acc, item) => {
    if (!acc[item.dayLabel]) {
      acc[item.dayLabel] = [];
    }
    acc[item.dayLabel].push(item);
    return acc;
  }, {});
}

export function NotificationCenter({ items }: NotificationCenterProps) {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<NotificationTab>("all");
  const [notifications, setNotifications] = useState(items);

  const filteredItems = useMemo(() => {
    if (activeTab === "unread") {
      return notifications.filter((item) => item.unread);
    }
    if (activeTab === "mentions") {
      return notifications.filter((item) => item.hasMention);
    }
    return notifications;
  }, [activeTab, notifications]);

  const groupedItems = useMemo(() => groupByDay(filteredItems), [filteredItems]);

  const unreadCount = notifications.filter((item) => item.unread).length;

  const tabs: { key: NotificationTab; label: string }[] = [
    { key: "all", label: t.dashboard.notificationCenter.tabs.all },
    { key: "unread", label: t.dashboard.notificationCenter.tabs.unread },
    { key: "mentions", label: t.dashboard.notificationCenter.tabs.mentions },
  ];

  return (
    <aside className="flex h-full min-h-0 w-full flex-col bg-surface">
      <header className="flex items-center justify-between border-b border-border-soft px-5 py-[14px]">
        <Text size={500} weight="semibold" className="text-[30px] leading-none text-foreground">
          {t.dashboard.notificationCenter.title}
        </Text>
        <button
          type="button"
          onClick={() => {
            setNotifications((current) =>
              current.map((item) => ({
                ...item,
                unread: false,
              })),
            );
          }}
          className="inline-flex h-[22px] items-center rounded-[3px] border border-border px-2 text-[10px] text-secondary hover:bg-sidebar"
        >
          {t.dashboard.notificationCenter.markAllAsRead}
        </button>
      </header>

      <div className="flex h-[44px] items-end gap-4 border-b border-border-soft px-5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`border-b-2 pb-[8px] text-[13px] ${activeTab === tab.key
                ? "border-primary text-foreground"
                : "border-transparent text-secondary hover:text-foreground"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {Object.entries(groupedItems).map(([dayLabel, dayItems]) => (
          <section key={dayLabel} className="border-b border-border-soft px-5 py-3">
            <Text size={200} className="mb-3 block text-[11px] text-secondary">
              {dayLabel}
            </Text>
            <div className="space-y-4">
              {dayItems.map((item) => (
                <article key={item.id} className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-2">
                      <span
                        className={`mt-[6px] inline-block h-[5px] w-[5px] shrink-0 rounded-full ${item.unread ? "bg-danger" : "bg-border"
                          }`}
                      />
                      <div className="flex min-w-0 flex-col items-start">
                        <Text className="text-[13px] leading-[18px] text-foreground">
                          {item.title}
                          {item.actor ? (
                            <span className="font-semibold"> {item.actor}</span>
                          ) : null}
                        </Text>
                        <Text size={200} className="mt-1 text-[12px] text-muted">
                          {item.relativeTime}
                        </Text>
                        <button
                          type="button"
                          className="mt-2 inline-flex h-[24px] items-center rounded-[4px] bg-primary px-3 text-[11px] text-primary-foreground"
                        >
                          {item.actionLabel}
                        </button>
                      </div>
                    </div>
                    <Text size={200} className="shrink-0 text-[12px] text-muted">
                      {item.time}
                    </Text>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        {filteredItems.length === 0 ? (
          <div className="px-5 py-8 text-center text-[13px] text-secondary">
            {activeTab === "unread" && unreadCount === 0
              ? t.dashboard.notificationCenter.empty.unread
              : t.dashboard.notificationCenter.empty.generic}
          </div>
        ) : null}
      </div>
    </aside>
  );
}
