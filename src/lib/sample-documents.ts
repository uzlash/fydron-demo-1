export const SAMPLE_PDF_PATH = "/sample-pdf.pdf" as const;
export const SAMPLE_DOCX_PATH = "/sample-docx.docx" as const;

export type DemoAttachmentKind = "pdf" | "docx";

export function demoAttachmentKindForEvidenceId(id: string): DemoAttachmentKind {
  return id === "2" ? "docx" : "pdf";
}
