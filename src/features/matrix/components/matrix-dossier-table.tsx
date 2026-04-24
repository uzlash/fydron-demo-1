"use client";

import { Checkbox } from "@fluentui/react-components";
import { MoreHorizontal16Regular } from "@fluentui/react-icons";
import { MatrixStatusChip } from "@/features/matrix/components/matrix-status-chip";
import type { MatrixDossierAuditMode, MatrixDossierRow } from "@/features/matrix/types";
import { useLocale } from "@/i18n/locale-context";

type MatrixDossierTableProps = {
  rows: MatrixDossierRow[];
  selectedIds: string[];
  onToggleOne: (id: string) => void;
  onToggleAll: () => void;
  onOpenReviewer: (row: MatrixDossierRow) => void;
  auditMode?: MatrixDossierAuditMode;
  /** When false, omits the Last updated column (e.g. Client Portfolio dossier view). */
  showLastUpdated?: boolean;
};

export function MatrixDossierTable({
  rows,
  selectedIds,
  onToggleAll,
  onToggleOne,
  onOpenReviewer,
  auditMode = "standard",
  showLastUpdated = true,
}: MatrixDossierTableProps) {
  const { t } = useLocale();
  const allSelected = rows.length > 0 && selectedIds.length === rows.length;
  const tableLocked = auditMode !== "standard";

  return (
    <div className="mt-3 overflow-x-auto rounded-[4px] border border-border-soft">
      <table className="w-full border-collapse text-[13px]">
        <thead className="sticky top-0 z-10 bg-surface text-left text-secondary">
          <tr className="border-b border-border-soft">
            <th className="w-[28px] px-3 py-3">
              <Checkbox checked={allSelected} onChange={onToggleAll} disabled={tableLocked} />
            </th>
            <th className="px-2 py-3 font-medium">{t.matrix.dossier.columns.title} ↕</th>
            <th className="px-2 py-3 font-medium">{t.matrix.dossier.columns.status} ↕</th>
            <th className="px-2 py-3 font-medium">{t.matrix.dossier.columns.requirementId}</th>
            {showLastUpdated ? (
              <th className="px-2 py-3 font-medium">{t.matrix.dossier.columns.lastUpdated} ↕</th>
            ) : null}
            <th className="w-[34px] px-2 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-border-soft text-foreground last:border-b-0 hover:bg-surface-muted">
              <td className="px-3 py-3">
                <Checkbox checked={selectedIds.includes(row.id)} onChange={() => onToggleOne(row.id)} disabled={tableLocked} />
              </td>
              <td className="px-2 py-3 text-[14px]">
                <button type="button" className="text-left hover:text-primary" onClick={() => onOpenReviewer(row)}>
                  {row.title}
                </button>
              </td>
              <td className="px-2 py-3">
                <MatrixStatusChip status={row.status} />
              </td>
              <td className="px-2 py-3 text-secondary">{row.requirementId}</td>
              {showLastUpdated ? <td className="px-2 py-3 text-secondary">{row.lastUpdated}</td> : null}
              <td className="px-2 py-3">
                <button
                  type="button"
                  aria-label={`Open reviewer panel for ${row.title}`}
                  className={`flex h-6 w-6 items-center justify-center rounded border border-border ${tableLocked ? "cursor-not-allowed text-muted opacity-45" : "text-secondary hover:bg-surface-muted"}`}
                  onClick={() => !tableLocked && onOpenReviewer(row)}
                  disabled={tableLocked}
                >
                  <MoreHorizontal16Regular />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
