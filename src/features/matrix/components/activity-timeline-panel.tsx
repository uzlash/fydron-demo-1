"use client";

import { ArrowRight16Regular, Dismiss20Regular, ArrowSync16Regular, Document16Regular, Info16Regular } from "@fluentui/react-icons";
import type { MatrixActivityItem, MatrixActivityTab } from "@/features/matrix/types";
import { useLocale } from "@/i18n/locale-context";

type ActivityTimelinePanelProps = {
  tab: MatrixActivityTab;
  onTabChange: (tab: MatrixActivityTab) => void;
  items: MatrixActivityItem[];
  onClose: () => void;
};

const toneConfig: Record<MatrixActivityItem["tone"], { dot: string; icon: React.ElementType; iconColor: string }> = {
  success: { dot: "bg-success", icon: ArrowSync16Regular, iconColor: "text-success" },
  info: { dot: "bg-primary", icon: Document16Regular, iconColor: "text-primary" },
  danger: { dot: "bg-danger", icon: Info16Regular, iconColor: "text-danger" },
};

export function ActivityTimelinePanel({ tab, onTabChange, items, onClose }: ActivityTimelinePanelProps) {
  const { t } = useLocale();
  const filtered = tab === "all" ? items : items.filter((item) => item.tab === tab);
  const groups = filtered.reduce<Record<string, MatrixActivityItem[]>>((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {});

  return (
    <aside className="flex h-full min-h-0 w-full flex-col bg-surface">
      <div className="flex items-start justify-between px-5 pb-4 pt-5">
        <div>
          <h3 className="text-[20px] font-semibold leading-none text-foreground">{t.matrix.activity.title}</h3>
          <p className="mt-2 text-[13px] text-secondary">{t.matrix.activity.subtitle}</p>
        </div>
        <button type="button" aria-label="Close activity timeline panel" onClick={onClose} className="text-secondary hover:text-foreground">
          <Dismiss20Regular />
        </button>
      </div>

      <div className="flex items-center gap-5 border-b border-border-soft px-5 text-[13px] font-medium">
        <button type="button" className={tab === "all" ? "border-b-2 border-primary pb-2 text-primary" : "pb-2 text-secondary hover:text-foreground"} onClick={() => onTabChange("all")}>
          {t.matrix.activity.tabs.all}
        </button>
        <button type="button" className={tab === "sync" ? "border-b-2 border-primary pb-2 text-primary" : "pb-2 text-secondary hover:text-foreground"} onClick={() => onTabChange("sync")}>
          {t.matrix.activity.tabs.sync}
        </button>
        <button type="button" className={tab === "uploads" ? "border-b-2 border-primary pb-2 text-primary" : "pb-2 text-secondary hover:text-foreground"} onClick={() => onTabChange("uploads")}>
          {t.matrix.activity.tabs.uploads}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-2">
        {Object.entries(groups).map(([day, group]) => (
          <div key={day} className="mb-6">
            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-border-soft" />
              <span className="text-[11px] text-secondary">{day}</span>
              <div className="h-px flex-1 bg-border-soft" />
            </div>
            <div className="flex flex-col">
              {group.map((item, idx) => {
                const Config = toneConfig[item.tone];
                const Icon = Config.icon;
                return (
                  <div key={item.id} className={`flex items-start gap-3 py-3 ${idx !== group.length - 1 ? "border-b border-border-soft" : ""}`}>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${Config.dot}`} />
                      <Icon className={`text-[16px] ${Config.iconColor}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[13px] font-medium text-foreground">{item.title}</p>
                        <span className="shrink-0 text-[11px] text-muted">{item.time}</span>
                      </div>
                      <p className="mt-0.5 text-[12px] text-secondary">{item.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="pb-6 pt-2 text-center">
          <button type="button" className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline">
            {t.matrix.activity.loadMore} <ArrowRight16Regular className="text-[14px]" />
          </button>
        </div>
      </div>
    </aside>
  );
}
