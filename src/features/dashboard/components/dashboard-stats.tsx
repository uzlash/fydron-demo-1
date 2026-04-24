"use client";

import { Card, Text } from "@fluentui/react-components";
import {
  Folder20Regular,
  ChatMultiple20Regular,
  CalendarLtr20Regular,
} from "@fluentui/react-icons";
import type { DashboardStat } from "@/features/dashboard/types";
import { useLocale } from "@/i18n/locale-context";

function iconFor(key: DashboardStat["key"]) {
  switch (key) {
    case "activeDossiers":
      return <Folder20Regular />;
    case "unreadMessages":
      return <ChatMultiple20Regular />;
    case "upcomingDeadlines":
      return <CalendarLtr20Regular />;
    default:
      return <Folder20Regular />;
  }
}

export function DashboardStats({ stats }: { stats: DashboardStat[] }) {
  const { t } = useLocale();

  return (
    <div className="w-full max-w-full sm:max-w-[56%]">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card
            key={stat.key}
            appearance="outline"
            className="flex h-20 flex-col justify-center rounded-md border border-border bg-surface shadow-none"
          >
            <div className="flex items-center gap-3 px-4">
              <span className="shrink-0 text-secondary [&_svg]:h-5 [&_svg]:w-5">
                {iconFor(stat.key)}
              </span>
              <div className="flex min-w-0 flex-col justify-center gap-0.5">
                <Text
                  size={500}
                  weight="semibold"
                  className="text-[20px] leading-none tabular-nums text-foreground"
                >
                  {stat.value}
                </Text>
                <Text size={200} className="text-[12px] leading-4 text-secondary">
                  {t.dashboard.stats[stat.key]}
                </Text>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
