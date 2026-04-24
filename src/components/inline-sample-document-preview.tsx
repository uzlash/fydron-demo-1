"use client";

import { useEffect, useState } from "react";
import mammoth from "mammoth";
import { Document20Regular } from "@fluentui/react-icons";
import {
  SAMPLE_DOCX_PATH,
  SAMPLE_PDF_PATH,
  type DemoAttachmentKind,
} from "@/lib/sample-documents";

type InlineSampleDocumentPreviewProps = {
  kind: DemoAttachmentKind;
  /** Shown in iframe title and loading UI */
  documentTitle: string;
  className?: string;
};

/**
 * Renders the public sample PDF (blob iframe) or DOCX (mammoth HTML) without modal chrome.
 * Used in Auditor Turbo main column; matches {@link DocumentPreviewModal} behavior.
 */
export function InlineSampleDocumentPreview({
  kind,
  documentTitle,
  className = "",
}: InlineSampleDocumentPreviewProps) {
  const [docxHtml, setDocxHtml] = useState<string | null>(null);
  const [docxError, setDocxError] = useState<string | null>(null);
  const [docxLoading, setDocxLoading] = useState(false);
  const [pdfObjectUrl, setPdfObjectUrl] = useState<string | null>(null);
  const [pdfLoadError, setPdfLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (kind !== "pdf") {
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
  }, [kind]);

  useEffect(() => {
    if (kind !== "docx") {
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
  }, [kind]);

  return (
    <div
      className={`flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-[#f3f2f1] ${className}`}
    >
      {kind === "pdf" ? (
        pdfLoadError ? (
          <div className="flex min-h-[200px] flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
            <Document20Regular className="h-8 w-8 text-muted" aria-hidden />
            <p className="text-[13px] text-danger">{pdfLoadError}</p>
          </div>
        ) : pdfObjectUrl ? (
          <iframe
            title={documentTitle}
            src={pdfObjectUrl}
            className="h-full min-h-[min(55vh,520px)] w-full flex-1 border-0"
          />
        ) : (
          <div className="flex min-h-[200px] flex-1 items-center justify-center text-[13px] text-secondary">
            Loading PDF…
          </div>
        )
      ) : docxLoading ? (
        <div className="flex min-h-[200px] flex-1 items-center justify-center text-[13px] text-secondary">
          Loading document…
        </div>
      ) : docxError ? (
        <div className="flex min-h-[200px] flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
          <Document20Regular className="h-8 w-8 text-muted" aria-hidden />
          <p className="text-[13px] text-danger">{docxError}</p>
        </div>
      ) : (
        <div className="min-h-0 min-w-0 flex-1 basis-0 overflow-y-auto overflow-x-hidden overscroll-y-contain px-4 py-3 sm:px-6 sm:py-4">
          <article
            className="docx-inline-preview mx-auto min-h-0 max-w-full [&_h1]:mb-3 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_li]:mb-1 [&_p]:mb-2 [&_p]:text-[13px] [&_p]:leading-relaxed"
            dangerouslySetInnerHTML={docxHtml ? { __html: docxHtml } : undefined}
          />
        </div>
      )}
    </div>
  );
}
