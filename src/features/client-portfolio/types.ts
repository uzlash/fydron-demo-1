import type { MatrixDossierRow } from "@/features/matrix/types";

export type ClientPortfolioRow = {
  id: string;
  name: string;
  frameworkCount: number;
  progress: number;
};

export type ClientDossier = {
  id: string;
  title: string;
  archived: boolean;
};

export type ClientDetail = {
  client: ClientPortfolioRow;
  dossiers: ClientDossier[];
};

export type ClientProfileRole = "Admin" | "Auditor" | "Reviewer" | "Contributor";

export type ClientProfileUser = {
  id: string;
  name: string;
  email: string;
  roles: ClientProfileRole[];
  lastActivity: string;
};

export type ClientProfileFramework = {
  id: string;
  name: string;
  progress: number;
  lastUpdated: string;
  /** Matrix dossier route segment */
  matrixDossierId: string;
};

export type ClientProfilePerson = {
  name: string;
  role: string;
  email: string;
  phone?: string;
  /** Passed to Avatar `name` */
  avatarName: string;
};

export type ClientProfileLegal = {
  legalName: string;
  kvkNumber: string;
  vatNumber: string;
  address: string;
  country: string;
  organisationType: string;
};

export type ClientProfile = {
  id: string;
  name: string;
  city: string;
  verified: boolean;
  activeFrameworkCount: number;
  legal: ClientProfileLegal;
  accountManager: ClientProfilePerson;
  primaryContact: ClientProfilePerson;
  users: ClientProfileUser[];
  frameworks: ClientProfileFramework[];
};

export type ClientProfileTab = "overview" | "users" | "dossiers" | "settings";

/** Client Portfolio → dossier view (reuses matrix dossier rows + reviewer side panel). */
export type ClientTurboDossierData = {
  clientId: string;
  clientName: string;
  dossierId: string;
  frameworkTitle: string;
  siteName: string;
  frameworkVersion: string;
  overallCompliance: number;
  lastSynced: string;
  rows: MatrixDossierRow[];
};
