import type {
  ClientDetail,
  ClientDossier,
  ClientPortfolioRow,
  ClientProfile,
  ClientTurboDossierData,
} from "@/features/client-portfolio/types";
import { matrixDossierReferenceMeta, matrixDossierReferenceRows } from "@/features/matrix/mock-data";
import { MATRIX_ACTIVATION_DOSSIER_ID } from "@/features/matrix/types";

const ROWS: ClientPortfolioRow[] = [
  { id: "acme", name: "Acme Corporation", frameworkCount: 15, progress: 82 },
  { id: "stark", name: "Stark Industries", frameworkCount: 1, progress: 82 },
  { id: "wayne", name: "Wayne Enterprises", frameworkCount: 1, progress: 82 },
  { id: "google", name: "Google", frameworkCount: 1, progress: 82 },
  { id: "facebook", name: "Facebook", frameworkCount: 1, progress: 82 },
  { id: "beta", name: "Beta Solutions", frameworkCount: 1, progress: 82 },
  { id: "acme-2", name: "Acme Europe BV", frameworkCount: 3, progress: 82 },
  { id: "stark-2", name: "Stark R&D", frameworkCount: 2, progress: 82 },
  { id: "wayne-2", name: "Wayne Holdings", frameworkCount: 1, progress: 82 },
  { id: "acme-3", name: "Acme Logistics", frameworkCount: 4, progress: 82 },
  { id: "stark-3", name: "Stark Defense", frameworkCount: 1, progress: 82 },
  { id: "wayne-3", name: "Wayne Med", frameworkCount: 2, progress: 82 },
];

const ACME_ACTIVE: ClientDossier[] = [
  { id: "d1", title: "ISO 27001", archived: false },
  { id: "d2", title: "ISO 9001", archived: false },
  { id: "d3", title: "ISO 45001", archived: false },
  { id: "d4", title: "VCA", archived: false },
];

const ACME_ARCHIVED: ClientDossier[] = [
  { id: "a1", title: "ISO 14001", archived: true },
];

function detailForId(id: string): ClientDetail | null {
  const client = ROWS.find((r) => r.id === id);
  if (!client) return null;

  if (id === "acme" || id === "acme-2") {
    return { client, dossiers: [...ACME_ACTIVE, ...ACME_ARCHIVED] };
  }

  if (id === "beta") {
    return { client, dossiers: [] };
  }

  if (id === "stark" || id === "wayne" || id === "google" || id === "facebook") {
    return {
      client,
      dossiers: [
        { id: "x1", title: "ISO 27001", archived: false },
        { id: "x2", title: "ISO 9001", archived: true },
      ],
    };
  }

  return {
    client,
    dossiers: [
      // Id matches `buildGenericProfile` framework `f1` so profile / matrix links align with this route.
      { id: "f1", title: "ISO 27001", archived: false },
    ],
  };
}

export function getClientPortfolioRows(): ClientPortfolioRow[] {
  return ROWS;
}

export function getClientDetail(clientId: string): ClientDetail | null {
  return detailForId(clientId);
}

const ACME_PROFILE: ClientProfile = {
  id: "acme",
  name: "Acme Corporation",
  city: "Amsterdam",
  verified: true,
  activeFrameworkCount: 3,
  legal: {
    legalName: "Acme Corporation",
    kvkNumber: "34123542",
    vatNumber: "NL001234567B01",
    address: "Spui 21, 1012AA Amsterdam",
    country: "Netherlands",
    organisationType: "Enterprise",
  },
  accountManager: {
    name: "Jan Hendriks",
    role: "Lead Advisor",
    email: "jam.hendriks@fydron.com",
    avatarName: "Jan Hendriks",
  },
  primaryContact: {
    name: "Marieke van der Berg",
    role: "Head of Information Security",
    email: "acme.101@mail.com",
    phone: "+31 20 525 000",
    avatarName: "Marieke van der Berg",
  },
  users: [
    { id: "u1", name: "Thomas Klein", email: "thomas.klein@acme.com", roles: ["Admin"], lastActivity: "1m ago" },
    { id: "u2", name: "Sanne de Vries", email: "s.devries@acme.com", roles: ["Auditor"], lastActivity: "1m ago" },
    { id: "u3", name: "Lars Meijer", email: "l.meijer@acme.com", roles: ["Reviewer", "Contributor"], lastActivity: "1m ago" },
    { id: "u4", name: "Emma van Dijk", email: "e.vandijk@acme.com", roles: ["Reviewer"], lastActivity: "12m ago" },
    { id: "u5", name: "Noah Jansen", email: "n.jansen@acme.com", roles: ["Contributor"], lastActivity: "2d ago" },
    { id: "u6", name: "Sofia Lindhout", email: "s.lindhout@acme.com", roles: ["Auditor", "Reviewer"], lastActivity: "1w ago" },
  ],
  frameworks: [
    { id: "f1", name: "ISO 27001", progress: 85, lastUpdated: "2nd Apr, 2026", matrixDossierId: MATRIX_ACTIVATION_DOSSIER_ID },
    { id: "f2", name: "NEN 7510", progress: 85, lastUpdated: "2nd Apr, 2026", matrixDossierId: MATRIX_ACTIVATION_DOSSIER_ID },
    { id: "f3", name: "VCA 201", progress: 85, lastUpdated: "2nd Apr, 2026", matrixDossierId: MATRIX_ACTIVATION_DOSSIER_ID },
    { id: "f4", name: "VCA 450", progress: 85, lastUpdated: "2nd Apr, 2026", matrixDossierId: MATRIX_ACTIVATION_DOSSIER_ID },
    { id: "f5", name: "NEN 101", progress: 85, lastUpdated: "2nd Apr, 2026", matrixDossierId: MATRIX_ACTIVATION_DOSSIER_ID },
    { id: "f6", name: "ISO 45001", progress: 85, lastUpdated: "2nd Apr, 2026", matrixDossierId: MATRIX_ACTIVATION_DOSSIER_ID },
    { id: "f7", name: "ISO 001-2022", progress: 85, lastUpdated: "2nd Apr, 2026", matrixDossierId: MATRIX_ACTIVATION_DOSSIER_ID },
    { id: "f8", name: "ISO 9001", progress: 85, lastUpdated: "2nd Apr, 2026", matrixDossierId: MATRIX_ACTIVATION_DOSSIER_ID },
    { id: "f9", name: "ISO 14001", progress: 85, lastUpdated: "2nd Apr, 2026", matrixDossierId: MATRIX_ACTIVATION_DOSSIER_ID },
    { id: "f10", name: "NEN 7511", progress: 85, lastUpdated: "2nd Apr, 2026", matrixDossierId: MATRIX_ACTIVATION_DOSSIER_ID },
    { id: "f11", name: "ISO 31000", progress: 85, lastUpdated: "2nd Apr, 2026", matrixDossierId: MATRIX_ACTIVATION_DOSSIER_ID },
    { id: "f12", name: "SOC 2", progress: 85, lastUpdated: "2nd Apr, 2026", matrixDossierId: MATRIX_ACTIVATION_DOSSIER_ID },
    { id: "f13", name: "GDPR", progress: 85, lastUpdated: "2nd Apr, 2026", matrixDossierId: MATRIX_ACTIVATION_DOSSIER_ID },
    { id: "f14", name: "PCI DSS", progress: 85, lastUpdated: "2nd Apr, 2026", matrixDossierId: MATRIX_ACTIVATION_DOSSIER_ID },
    { id: "f15", name: "ISO 22301", progress: 85, lastUpdated: "2nd Apr, 2026", matrixDossierId: MATRIX_ACTIVATION_DOSSIER_ID },
  ],
};

function buildGenericProfile(row: ClientPortfolioRow): ClientProfile {
  return {
    id: row.id,
    name: row.name,
    city: "Amsterdam",
    verified: true,
    activeFrameworkCount: Math.min(3, row.frameworkCount),
    legal: {
      legalName: row.name,
      kvkNumber: "00000000",
      vatNumber: "NL000000000B01",
      address: "—",
      country: "Netherlands",
      organisationType: "Enterprise",
    },
    accountManager: {
      name: "Jan Hendriks",
      role: "Lead Advisor",
      email: "jam.hendriks@fydron.com",
      avatarName: "Jan Hendriks",
    },
    primaryContact: {
      name: "Contact Person",
      role: "Security Lead",
      email: "contact@example.com",
      phone: "+31 20 000 0000",
      avatarName: "Contact Person",
    },
    users: [
      {
        id: "u1",
        name: "Thomas Klein",
        email: "user@mail.com",
        roles: ["Admin"],
        lastActivity: "1m ago",
      },
    ],
    frameworks: [
      {
        id: "f1",
        name: "ISO 27001",
        progress: 85,
        lastUpdated: "2nd Apr, 2026",
        matrixDossierId: MATRIX_ACTIVATION_DOSSIER_ID,
      },
    ],
  };
}

export function getClientProfile(clientId: string): ClientProfile | null {
  const row = ROWS.find((r) => r.id === clientId);
  if (!row) return null;
  if (clientId === "acme") return ACME_PROFILE;
  return buildGenericProfile(row);
}

export function getClientTurboDossierData(clientId: string, dossierId: string): ClientTurboDossierData | null {
  const detail = getClientDetail(clientId);
  if (!detail) return null;

  const lookupId = dossierId === "g1" ? "f1" : dossierId;
  let dossier = detail.dossiers.find((d) => d.id === lookupId);
  if (!dossier) {
    const profile = getClientProfile(clientId);
    if (!profile) return null;
    const fw = profile.frameworks.find(
      (f) => f.id === lookupId || f.id === dossierId || f.matrixDossierId === dossierId || f.matrixDossierId === lookupId
    );
    if (!fw) return null;
    dossier = { id: fw.id, title: fw.name, archived: false };
  }

  const meta = matrixDossierReferenceMeta;
  return {
    clientId: detail.client.id,
    clientName: detail.client.name,
    dossierId: dossier.id,
    frameworkTitle: dossier.title,
    siteName: meta.organizationName,
    frameworkVersion: meta.frameworkVersion,
    overallCompliance: meta.overallCompliance,
    lastSynced: meta.lastSynced,
    rows: matrixDossierReferenceRows,
  };
}
