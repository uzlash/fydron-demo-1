"use client";

import { Button } from "@fluentui/react-components";
import { useLocale } from "@/i18n/locale-context";

type MatrixChangeWorkflowConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function BulletItem({ label, children }: { label: string; children: string }) {
  return (
    <li className="text-[13px] leading-relaxed text-foreground">
      <span className="font-semibold">{label}</span> {children}
    </li>
  );
}

export function MatrixChangeWorkflowConfirmModal({
  open,
  onClose,
  onConfirm,
}: MatrixChangeWorkflowConfirmModalProps) {
  const { t } = useLocale();
  const c = t.matrix.dossier.changeWorkflowConfirm;

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close change workflow dialog"
        className="fixed inset-0 z-[60] bg-black/45"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="matrix-change-workflow-confirm-title"
        className="fixed left-1/2 top-1/2 z-[70] w-[min(480px,92vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[4px] border border-border bg-surface shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
      >
        <div className="px-6 pb-2 pt-6">
          <h2 id="matrix-change-workflow-confirm-title" className="app-page-title">
            {c.title}
          </h2>
          <p className="mt-4 text-[13px] leading-relaxed text-foreground">{c.intro}</p>
          <ul className="mt-4 list-none space-y-2.5 pl-0">
            <BulletItem label={c.preservedLabel}>{c.preserved}</BulletItem>
            <BulletItem label={c.resetLabel}>{c.reset}</BulletItem>
            <BulletItem label={c.autoUpdateLabel}>{c.autoUpdate}</BulletItem>
          </ul>
          <p className="mt-5 text-[13px] font-medium leading-relaxed text-foreground">{c.irreversible}</p>
        </div>
        <div className="flex flex-row-reverse flex-wrap items-center justify-start gap-2 border-t border-border-soft px-6 py-3.5">
          <Button
            appearance="primary"
            className="h-8 min-h-8 rounded-[4px] px-4 text-[13px] font-medium"
            onClick={onConfirm}
          >
            {c.confirm}
          </Button>
          <Button
            appearance="outline"
            className="h-8 min-h-8 rounded-[4px] px-4 text-[13px] font-medium"
            onClick={onClose}
          >
            {c.cancel}
          </Button>
        </div>
      </div>
    </>
  );
}
