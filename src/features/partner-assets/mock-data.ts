import type { PartnerAssetDocument, PartnerOrganisation } from "@/features/partner-assets/types";

/** Demo org list: order and repeats mirror the Partner Assets Figma walkthrough. */
export const PARTNER_ORGANISATIONS: PartnerOrganisation[] = [
  { id: "acme-corporation", name: "Acme Corporation" },
  { id: "stark-industries", name: "Stark Industries" },
  { id: "beta-solutions", name: "Beta Solutions" },
  { id: "wayne-enterprises", name: "Wayne Enterprises" },
  { id: "google", name: "Google" },
  { id: "facebook", name: "Facebook" },
  { id: "acme-corporation-2", name: "Acme Corporation" },
  { id: "wayne-enterprises-2", name: "Wayne Enterprises" },
  { id: "beta-solutions-2", name: "Beta Solutions" },
  { id: "beta-solutions-3", name: "Beta Solutions" },
  { id: "beta-solutions-4", name: "Beta Solutions" },
  { id: "stark-industries-2", name: "Stark Industries" },
];

const DEMO_DOCS: PartnerAssetDocument[] = [
  {
    id: "d1",
    name: "Risk Assessment Report",
    type: "PDF",
    version: "v1.1",
    size: "12.5 MB",
    validUntilLabel: "Dec 24, 2025",
    status: "expiringSoon",
  },
  {
    id: "d2",
    name: "Compliance Audit",
    type: "PDF",
    version: "v1.1",
    size: "2.0 MB",
    validUntilLabel: "Dec 24, 2025",
    status: "approved",
  },
  {
    id: "d3",
    name: "Financial Statement",
    type: "DOCX",
    version: "v1.1",
    size: "890 KB",
    validUntilLabel: "Dec 24, 2025",
    status: "approved",
  },
  {
    id: "d4",
    name: "Security Policy",
    type: "PDF",
    version: "v1.1",
    size: "1.2 MB",
    validUntilLabel: "Dec 24, 2025",
    status: "expired",
  },
  {
    id: "d5",
    name: "Incident Response Plan",
    type: "PDF",
    version: "v1.1",
    size: "3.4 MB",
    validUntilLabel: "Dec 24, 2025",
    status: "expiringSoon",
  },
  {
    id: "d6",
    name: "Vendor Agreement",
    type: "PDF",
    version: "v1.1",
    size: "640 KB",
    validUntilLabel: "Dec 24, 2025",
    status: "approved",
  },
  {
    id: "d7",
    name: "Data Processing Addendum",
    type: "DOCX",
    version: "v1.1",
    size: "420 KB",
    validUntilLabel: "Dec 24, 2025",
    status: "expired",
  },
  {
    id: "d8",
    name: "Penetration Test Summary",
    type: "PDF",
    version: "v1.1",
    size: "5.1 MB",
    validUntilLabel: "Dec 24, 2025",
    status: "approved",
  },
];

export function getPartnerOrganisationById(id: string): PartnerOrganisation | undefined {
  return PARTNER_ORGANISATIONS.find((o) => o.id === id);
}

export function getPartnerAssetDocumentsForOrg(_orgId: string): PartnerAssetDocument[] {
  return DEMO_DOCS;
}
