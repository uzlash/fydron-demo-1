"use client";

import { Button } from "@fluentui/react-components";
import { ArrowSync16Regular, Dismiss20Regular } from "@fluentui/react-icons";
import { useLocale } from "@/i18n/locale-context";

type MatrixFrameworkMigrationModalProps = {
  open: boolean;
  onClose: () => void;
};

const rows: { title: string; description: string }[] = [
  {
    title: "Clause 3.4",
    description: "Revised privacy terms for compliance with the Oberon Initiative.",
  },
  {
    title: "Clause 7.1 — 7.1",
    description: "Updated access control requirements for hybrid workforce environments.",
  },
  {
    title: "Acme Corp",
    description: "Organizational security policy alignment with ISO 27001:2022 annex controls.",
  },
  {
    title: "Beta Solutions",
    description: "Incident reporting timelines and escalation paths clarified for auditors.",
  },
];

export function MatrixFrameworkMigrationModal({ open, onClose }: MatrixFrameworkMigrationModalProps) {
  const { t } = useLocale();
  if (!open) return null;

  return (
    <>
      <button type="button" aria-label="Close framework migration" className="fixed inset-0 z-[60] bg-black/45" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="matrix-migration-title"
        className="fixed left-1/2 top-1/2 z-[70] w-full max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-[4px] border border-border bg-surface shadow-2xl"
      >
        <header className="flex items-start justify-between border-b border-border-soft px-6 pb-4 pt-5">
          <div>
            <h2 id="matrix-migration-title" className="text-[22px] font-normal leading-tight text-foreground">
              {t.matrix.dossier.migration.title}
            </h2>
            <p className="mt-1.5 text-[13px] text-secondary">{t.matrix.dossier.migration.subtitle}</p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="text-secondary hover:text-foreground">
            <Dismiss20Regular />
          </button>
        </header>
        <div className="max-h-[min(420px,55vh)] overflow-y-auto px-6 py-4">
          <ul className="space-y-0 divide-y divide-border-soft">
            {rows.map((row) => (
              <li key={row.title} className="flex gap-4 py-4 first:pt-0">
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold text-foreground">{row.title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-secondary">{row.description}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1 pt-0.5">
                  <span className="inline-flex items-center gap-1 rounded-[3px] border border-border-soft bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-secondary">
                    <ArrowSync16Regular className="text-primary" />
                    {t.matrix.dossier.migration.inReview}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <footer className="flex justify-end gap-2 border-t border-border-soft px-6 py-4">
          <Button appearance="outline" className="h-9 rounded-[3px] px-4 text-[13px]" onClick={onClose}>
            {t.matrix.dossier.migration.stay}
          </Button>
          <Button appearance="primary" className="h-9 rounded-[3px] px-4 text-[13px]" onClick={onClose}>
            {t.matrix.dossier.migration.upgrade}
          </Button>
        </footer>
      </div>
    </>
  );
}
