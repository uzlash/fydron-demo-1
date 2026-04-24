"use client";

import { useMemo, useState } from "react";
import { Button } from "@fluentui/react-components";
import {
  ArrowDownload16Regular,
  ArrowUpload16Regular,
  CheckmarkCircle16Filled,
  Delete16Regular,
  Dismiss20Regular,
  Link16Regular,
} from "@fluentui/react-icons";
import type { MatrixDossierRow } from "@/features/matrix/types";
import { useLocale } from "@/i18n/locale-context";

const REQUIRED_ELEMENT_LINES = [
  "Defined incident categories",
  "Assigned incident response roles",
  "Escalation matrix",
  "Documentation procedures",
  "Post-incident review process",
] as const;

const EVIDENCE_CHECKLIST = [
  "Incident response policy document",
  "Past incident reports",
  "Escalation logs",
  "Review meeting minutes",
] as const;

type FileSource = "cam" | "local";

const INITIAL_FILES: { id: string; label: string; meta: string; source: FileSource }[] = [
  { id: "1", label: "Security Audit Report", meta: "DOCX • 1.5MB", source: "cam" },
  { id: "2", label: "Review Meeting Minutes", meta: "PDF • 2.98MB", source: "local" },
  { id: "3", label: "Network Vulnerability Assessment", meta: "PDF • 2.98MB", source: "cam" },
];

type Tab = "assessment" | "discussion";

type MatrixContributorRequirementViewProps = {
  row: MatrixDossierRow;
  onClose: () => void;
};

function getRequirementTitle(r: MatrixDossierRow) {
  if (r.id === "d1") return "5.1.1 - Management Commitment";
  if (r.id === "d2") return "A.5.1 - Information Security Policies";
  return r.title;
}

export function MatrixContributorRequirementView({ row, onClose }: MatrixContributorRequirementViewProps) {
  const { t } = useLocale();
  const c = t.matrix.dossier.contributor;
  const mr = t.matrix.reviewer;
  const [activeTab, setActiveTab] = useState<Tab>("assessment");
  const [files, setFiles] = useState(INITIAL_FILES);

  const title = useMemo(() => getRequirementTitle(row), [row]);

  const removeFile = (id: string) => {
    setFiles((list) => list.filter((f) => f.id !== id));
  };

  return (
    <aside className="flex h-full min-h-0 w-full min-w-0 flex-col bg-surface">
      <header className="shrink-0 border-b border-border-soft px-5 pb-4 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[20px] font-semibold leading-none text-foreground">{title}</h2>
            <p className="mt-2 text-[12px] text-secondary">{mr.subtitle}</p>
          </div>
          <button
            type="button"
            aria-label={c.closePanel}
            onClick={onClose}
            className="text-secondary hover:text-foreground"
          >
            <Dismiss20Regular />
          </button>
        </div>
        <div className="mt-5 flex items-center gap-6 text-[14px] font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("assessment")}
            className={`border-b-[3px] pb-1.5 ${activeTab === "assessment" ? "border-primary text-foreground" : "border-transparent text-secondary"}`}
          >
            {mr.tabs.assessment}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("discussion")}
            className={`border-b-[3px] pb-1.5 ${activeTab === "discussion" ? "border-primary text-foreground" : "border-transparent text-secondary"}`}
          >
            {c.discussion}
          </button>
        </div>
      </header>

      {activeTab === "assessment" ? (
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <section>
            <h3 className="text-[15px] font-semibold text-foreground">Incident Response Requirements</h3>
            <p className="mt-1.5 text-[13px] leading-[1.6] text-secondary">{mr.requirementsBody}</p>
            <h4 className="mt-5 text-[14px] font-semibold text-foreground">{c.requiredElements}</h4>
            <ul className="mt-2 space-y-1.5 text-[13px] text-secondary">
              {REQUIRED_ELEMENT_LINES.map((line) => (
                <li key={line}>• {line}</li>
              ))}
            </ul>
          </section>

          <div className="mt-6 border-t border-border-soft pt-5">
            <h4 className="text-[14px] font-semibold text-foreground">{mr.evidenceGuidance}</h4>
            <p className="mt-1.5 text-[12px] leading-relaxed text-secondary">{mr.evidenceBody}</p>
            <ul className="mt-3 space-y-2.5 text-[12px] font-medium">
              {EVIDENCE_CHECKLIST.map((item) => (
                <li key={item} className="flex items-center gap-2 text-foreground">
                  <CheckmarkCircle16Filled className="h-4 w-4 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 border-t border-border-soft pt-5">
            <div className="flex flex-col items-center justify-center rounded-[4px] border border-dashed border-border-strong bg-surface-muted/40 px-6 py-10 text-center">
              <ArrowUpload16Regular className="text-[28px] text-muted" aria-hidden />
              <p className="mt-3 text-[13px] text-secondary">
                {mr.dropZonePrefix} <span className="font-medium text-primary">{mr.dropZoneBrowse}</span>
              </p>
              <p className="mt-1.5 text-[12px] text-muted">{mr.dropZoneFormats}</p>
            </div>
          </div>

          <div className="mt-6 border-t border-border-soft pt-5 pb-2">
            <h4 className="text-[14px] font-semibold text-foreground">{c.uploadedEvidence}</h4>
            <div className="mt-4 space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-start justify-between gap-3 rounded-[4px] border border-border-soft bg-surface p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <div className="relative flex h-11 w-9 shrink-0 items-center justify-center rounded-sm bg-[#e1dfdd]">
                      <div
                        className="absolute right-0 top-0 h-0 w-0 border-b-[10px] border-l-[10px] border-b-black/10 border-l-transparent"
                        aria-hidden
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-foreground">{file.label}</p>
                      <p className="mt-0.5 text-[12px] text-muted">{file.meta}</p>
                      <div className="mt-2">
                        {file.source === "cam" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d8f4ff] px-2.5 py-1 text-[11px] font-medium text-primary">
                            <Link16Regular className="h-3.5 w-3.5" aria-hidden />
                            {c.linkedFromCam}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f7ee] px-2.5 py-1 text-[11px] font-medium text-[#0b5c2e]">
                            <ArrowDownload16Regular className="h-3.5 w-3.5" aria-hidden />
                            {c.uploadedLocally}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 text-danger hover:opacity-80"
                    aria-label={c.removeFile}
                    onClick={() => removeFile(file.id)}
                  >
                    <Delete16Regular className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-border-soft pt-6">
            <p className="text-[13px] font-medium text-foreground">{c.selectFromCam}</p>
            <Button appearance="primary" className="mt-2.5 h-10 w-full max-w-md rounded-md px-4 text-[14px] font-semibold">
              {c.browseCentralAssetManager}
            </Button>
          </div>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-8">
          <p className="text-center text-[14px] text-secondary">{c.discussionPlaceholder}</p>
        </div>
      )}
    </aside>
  );
}
