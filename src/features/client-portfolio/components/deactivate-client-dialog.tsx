"use client";

import { Button } from "@fluentui/react-components";
import { CLIENT_DANGER_BUTTON_CLASS_COMPACT } from "@/features/client-portfolio/components/client-danger-button-classes";
import { useLocale } from "@/i18n/locale-context";

type DeactivateClientDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeactivateClientDialog({ open, onClose, onConfirm }: DeactivateClientDialogProps) {
  const { t } = useLocale();
  const p = t.clientPortfolio.profile;

  if (!open) return null;

  return (
    <>
      <button type="button" aria-label="Close" className="fixed inset-0 z-40 bg-black/45" onClick={onClose} />
      <div
        className="fixed left-1/2 top-1/2 z-50 w-[min(400px,92vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[4px] border border-border bg-surface shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="deactivate-client-title"
      >
        <div className="px-6 pb-2 pt-6">
          <h2 id="deactivate-client-title" className="text-[20px] font-semibold text-foreground">
            {p.deactivateDialog.title}
          </h2>
          <p className="mt-2 text-[14px] text-secondary">{p.deactivateDialog.body}</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border-soft px-6 py-3.5">
          <Button appearance="outline" className="h-8 min-h-8 rounded-[4px] px-4 text-[13px]" onClick={onClose}>
            {p.deactivateDialog.cancel}
          </Button>
          <Button appearance="primary" className={CLIENT_DANGER_BUTTON_CLASS_COMPACT} onClick={onConfirm}>
            {p.deactivateDialog.confirm}
          </Button>
        </div>
      </div>
    </>
  );
}
