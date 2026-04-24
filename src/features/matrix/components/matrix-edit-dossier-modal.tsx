"use client";

import { useEffect, useState } from "react";
import { Button, Field, Input } from "@fluentui/react-components";
import { Info16Regular } from "@fluentui/react-icons";
import { useLocale } from "@/i18n/locale-context";

export type MatrixEditDossierWorkflow = "standard" | "direct";

type MatrixEditDossierModalProps = {
  open: boolean;
  onClose: () => void;
  defaultDossierName: string;
  defaultWorkflow?: MatrixEditDossierWorkflow;
  onContinue?: (payload: { dossierName: string; workflow: MatrixEditDossierWorkflow }) => void;
};

export function MatrixEditDossierModal({
  open,
  onClose,
  defaultDossierName,
  defaultWorkflow = "standard",
  onContinue,
}: MatrixEditDossierModalProps) {
  const { t } = useLocale();
  const m = t.matrix.dossier.editDossierDialog;
  const a = t.matrix.portfolio.activateDialog;
  const [dossierName, setDossierName] = useState(defaultDossierName);
  const [workflow, setWorkflow] = useState<MatrixEditDossierWorkflow>(defaultWorkflow);

  useEffect(() => {
    if (!open) return;
    setDossierName(defaultDossierName);
    setWorkflow(defaultWorkflow);
  }, [open, defaultDossierName, defaultWorkflow]);

  if (!open) return null;

  const handleContinue = () => {
    onContinue?.({ dossierName: dossierName.trim(), workflow });
  };

  return (
    <>
      <button type="button" aria-label="Close edit dossier dialog" className="fixed inset-0 z-40 bg-black/45" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="matrix-edit-dossier-title"
        className="fixed left-1/2 top-1/2 z-50 w-[min(720px,92vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[4px] border border-border bg-surface shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
      >
        <div className="px-6 pb-5 pt-5">
          <h2 id="matrix-edit-dossier-title" className="app-page-title">
            {m.title}
          </h2>

          <Field label={m.dossierNameLabel} size="small" className="mt-5 w-full min-w-0">
            <Input
              className="h-8 min-h-8 w-full min-w-0 text-[13px] [&>input]:min-w-0"
              value={dossierName}
              onChange={(_, d) => setDossierName(d.value)}
              placeholder={m.dossierNamePlaceholder}
              size="small"
            />
          </Field>

          <p className="mb-2 mt-5 text-[13px] text-secondary">{m.changeWorkflow}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setWorkflow("standard")}
              className={`overflow-hidden rounded-[4px] border bg-surface text-left transition-colors ${
                workflow === "standard" ? "border-primary ring-1 ring-primary" : "border-border-soft"
              }`}
            >
              <div className="px-4 py-3.5">
                <div className="flex items-start gap-2.5">
                  <span
                    className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
                      workflow === "standard" ? "border-primary" : "border-foreground/40"
                    }`}
                    aria-hidden
                  >
                    {workflow === "standard" ? <span className="h-2.5 w-2.5 rounded-full bg-primary" /> : null}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-foreground">{a.standardUnit}</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-secondary">{a.standardSubtitle}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 border-t border-border-soft bg-surface-muted px-4 py-2 text-[12px] text-foreground">
                <Info16Regular className="shrink-0 text-secondary" />
                {a.fullReviewProcess}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setWorkflow("direct")}
              className={`overflow-hidden rounded-[4px] border bg-surface text-left transition-colors ${
                workflow === "direct" ? "border-primary ring-1 ring-primary" : "border-border-soft"
              }`}
            >
              <div className="px-4 py-3.5">
                <div className="flex items-start gap-2.5">
                  <span
                    className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
                      workflow === "direct" ? "border-primary" : "border-foreground/40"
                    }`}
                    aria-hidden
                  >
                    {workflow === "direct" ? <span className="h-2.5 w-2.5 rounded-full bg-primary" /> : null}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-foreground">{a.directAuditor}</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-secondary">{a.directSubtitle}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 border-t border-border-soft bg-surface-muted px-4 py-2 text-[12px] text-foreground">
                <Info16Regular className="shrink-0 text-secondary" />
                {a.immediateReady}
              </div>
            </button>
          </div>
        </div>

        <div className="flex flex-row-reverse flex-wrap items-center justify-start gap-2 border-t border-border-soft px-6 py-3.5">
          <Button appearance="primary" className="h-8 min-h-8 rounded-[4px] px-4 text-[13px] font-medium" onClick={handleContinue}>
            {m.continue}
          </Button>
          <Button appearance="outline" className="h-8 min-h-8 rounded-[4px] px-4 text-[13px] font-medium" onClick={onClose}>
            {m.cancel}
          </Button>
        </div>
      </div>
    </>
  );
}
