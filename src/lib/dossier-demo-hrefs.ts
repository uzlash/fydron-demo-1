import type { DossierRow } from "@/features/dashboard/types";
import type { MatrixPortfolioRow } from "@/features/matrix/types";

export const MATRIX_DEMO_HREF = "/matrix/p1" as const;

export const DASHBOARD_AUDITOR_CLIENT_HREF = "/client-portfolio/acme/dossier/d1" as const;
export const MATRIX_PORTFOLIO_AUDITOR_CLIENT_HREF = "/client-portfolio/acme/dossier/d2" as const;

export function hrefForDashboardDossierRow(row: DossierRow): string {
  return row.role === "Auditor" ? DASHBOARD_AUDITOR_CLIENT_HREF : MATRIX_DEMO_HREF;
}

export function hrefForMatrixPortfolioRow(row: MatrixPortfolioRow): string {
  return row.role === "Auditor" ? MATRIX_PORTFOLIO_AUDITOR_CLIENT_HREF : MATRIX_DEMO_HREF;
}
