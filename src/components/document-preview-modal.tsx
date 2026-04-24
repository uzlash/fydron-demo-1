"use client";

import { useEffect, useState } from "react";
import mammoth from "mammoth";
import { Dismiss20Regular, Document20Regular } from "@fluentui/react-icons";
import {
  SAMPLE_DOCX_PATH,
  SAMPLE_PDF_PATH,
  type DemoAttachmentKind,
} from "@/lib/sample-documents";

type DocumentPreviewModalProps = {
  open: boolean;
  onClose: () => void;
  layout?: "drawer" | "inline";
  kind: DemoAttachmentKind;
  documentTitle: string;
};

export function DocumentPreviewModal({
  open,
  onClose,
  layout = "drawer",
  kind,
  documentTitle,
}: DocumentPreviewModalProps) {
  const [docxHtml, setDocxHtml] = useState<string | null>(null);
  const [docxError, setDocxError] = useState<string | null>(null);
  const [docxLoading, setDocxLoading] = useState(false);
  const [pdfObjectUrl, setPdfObjectUrl] = useState<string | null>(null);
  const [pdfLoadError, setPdfLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || kind !== "pdf") {
      setPdfObjectUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setPdfLoadError(null);
      return;
    }
    let cancelled = false;
    setPdfLoadError(null);
    (async () => {
      try {
        const res = await fetch(SAMPLE_PDF_PATH);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = await res.arrayBuffer();
        const blob = new Blob([buf], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        setPdfObjectUrl((old) => {
          if (old) URL.revokeObjectURL(old);
          return url;
        });
      } catch (e) {
        if (!cancelled) {
          setPdfLoadError(e instanceof Error ? e.message : "Could not load PDF");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, kind]);

  useEffect(() => {
    if (!open || kind !== "docx") {
      setDocxHtml(null);
      setDocxError(null);
      setDocxLoading(false);
      return;
    }
    let cancelled = false;
    setDocxLoading(true);
    setDocxError(null);
    setDocxHtml(null);
    (async () => {
      try {
        const res = await fetch(SAMPLE_DOCX_PATH);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const arrayBuffer = await res.arrayBuffer();
        const { value } = await mammoth.convertToHtml({ arrayBuffer });
        if (!cancelled) setDocxHtml(value);
      } catch (e) {
        if (!cancelled) {
          setDocxError(e instanceof Error ? e.message : "Could not load document");
        }
      } finally {
        if (!cancelled) setDocxLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, kind]);

  if (!open) return null;

  const panelClassName =
    layout === "inline"
      ? "fixed left-4 right-4 top-4 bottom-4 z-[250] flex min-h-0 min-w-0 flex-col rounded-[2px] border border-border bg-surface shadow-2xl sm:left-6 sm:right-6 sm:top-6 sm:bottom-6"
      : "fixed left-[250px] right-[460px] top-[10px] z-50 flex h-[calc(100vh-20px)] min-h-0 min-w-0 flex-col rounded-[2px] border border-border bg-surface shadow-2xl";

  const scrimZ = layout === "inline" ? "z-[240]" : "z-40";

  return (
    <>
      <button
        type="button"
        aria-label="Close document preview"
        className={`fixed inset-0 ${scrimZ} bg-black/40`}
        onClick={onClose}
      />
      <section className={panelClassName} aria-modal="true" role="dialog">
        <header className="flex shrink-0 items-center justify-between border-b border-border-soft px-5 py-4">
          <div>
            <h3 className="text-[20px] font-semibold leading-none text-foreground">{documentTitle}</h3>
            <span className="mt-1.5 inline-flex items-center gap-1 rounded bg-[#d8f4ff] px-2 py-0.5 text-[10px] font-medium text-primary">
              <span className="mb-[1px] text-[12px] leading-none">↹</span> Linked from Central Asset Manager
            </span>
          </div>
          <button
            type="button"
            aria-label="Close document preview"
            onClick={onClose}
            className="text-secondary hover:text-foreground"
          >
            <Dismiss20Regular />
          </button>
        </header>

        <div className="flex min-h-[400px] flex-1 flex-col overflow-hidden bg-[#f3f2f1]">
          {kind === "pdf" ? (
            pdfLoadError ? (
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
                <Document20Regular className="h-10 w-10 text-muted" aria-hidden />
                <p className="text-[13px] text-danger">{pdfLoadError}</p>
              </div>
            ) : pdfObjectUrl ? (
              <iframe
                title={documentTitle}
                src={pdfObjectUrl}
                className="min-h-0 w-full flex-1 border-0"
              />
            ) : (
              <div className="flex min-h-0 flex-1 items-center justify-center text-[13px] text-secondary">
                Loading PDF…
              </div>
            )
          ) : docxLoading ? (
            <div className="flex h-full min-h-[400px] items-center justify-center text-[13px] text-secondary">
              Loading document…
            </div>
          ) : docxError ? (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-2 px-6 text-center">
              <Document20Regular className="h-10 w-10 text-muted" aria-hidden />
              <p className="text-[13px] text-danger">{docxError}</p>
            </div>
          ) : (
            <div className="min-h-0 min-w-0 flex-1 basis-0 overflow-y-auto overflow-x-hidden overscroll-y-contain px-5 py-4">
              <article
                className="docx-html-preview mx-auto min-h-0 max-w-[800px] rounded bg-white p-8 shadow-[0_2px_4px_rgba(0,0,0,0.1)] [&_h1]:mb-3 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_li]:mb-1 [&_p]:mb-2 [&_p]:text-[13px] [&_p]:leading-relaxed"
                dangerouslySetInnerHTML={docxHtml ? { __html: docxHtml } : undefined}
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
