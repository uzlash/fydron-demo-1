"use client";

import { Dismiss20Regular } from "@fluentui/react-icons";
import type { MatrixChapterProgress } from "@/features/matrix/types";
import { useLocale } from "@/i18n/locale-context";

type ComplianceOverviewPanelProps = {
  chapters: MatrixChapterProgress[];
  onClose: () => void;
};

export function ComplianceOverviewPanel({ chapters, onClose }: ComplianceOverviewPanelProps) {
  const { t } = useLocale();

  // Group chapters into pairs for rows
  const rows: MatrixChapterProgress[][] = [];
  for (let i = 0; i < chapters.length; i += 2) {
    rows.push(chapters.slice(i, i + 2));
  }

  return (
    <aside className="flex h-full min-h-0 w-full flex-col bg-surface">
      <div className="flex items-start justify-between border-b border-border-soft px-5 pb-4 pt-5">
        <div>
          <h3 className="text-[20px] font-semibold leading-none text-foreground">{t.matrix.compliance.title}</h3>
          <p className="mt-2 text-[13px] text-secondary">{t.matrix.compliance.subtitle}</p>
        </div>
        <button type="button" aria-label="Close compliance overview panel" onClick={onClose} className="text-secondary hover:text-foreground">
          <Dismiss20Regular />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <div className="rounded-[4px] border border-border-soft p-4">
          {rows.map((row, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-x-6 border-b border-border-soft py-5 first:pt-0 last:border-0 last:pb-0">
              {row.map((chapter) => (
                <div key={chapter.id}>
                  <p className="text-[13px] font-medium text-foreground">{chapter.label}</p>
                  <div className="mt-2.5 h-1.5 w-full rounded-full bg-border-soft">
                    <div className="h-full rounded-full bg-[#00ca48]" style={{ width: `${chapter.percent}%` }} />
                  </div>
                  <p className="mt-1.5 text-[12px] text-secondary">{chapter.percent}%</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
