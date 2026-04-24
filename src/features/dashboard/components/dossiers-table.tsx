"use client";

import { Button, Input, Text } from "@fluentui/react-components";
import { Filter20Regular, Search20Regular } from "@fluentui/react-icons";
import { useRouter } from "next/navigation";
import type { DossierRow } from "@/features/dashboard/types";
import { hrefForDashboardDossierRow } from "@/lib/dossier-demo-hrefs";
import { useLocale } from "@/i18n/locale-context";

/** Fydron V2 Figma: Admin (neutral), Uploader (grey), Contributor (pink), Reviewer (dark), Auditor (brand blue) */
function roleClass(role: DossierRow["role"]) {
  switch (role) {
    case "Admin":
      return "bg-[#f3f2f1] text-[#323130]";
    case "Auditor":
      return "bg-primary text-white";
    case "Reviewer":
      return "bg-[#1f1f1f] text-white";
    case "Contributor":
      return "bg-[#fce1e6] text-[#a4262c]";
    case "Uploader":
      return "bg-[#edebe9] text-[#323130]";
    default:
      return "bg-[#edebe9] text-[#323130]";
  }
}

function ProgressCell({ value }: { value: number }) {
  return (
    <div className="flex min-w-0 items-center justify-end gap-4 pr-2 sm:gap-6 sm:pr-8">
      <div className="h-[3px] w-full max-w-[140px] rounded-sm bg-border">
        <div
          className="h-full rounded-sm bg-primary"
          style={{ width: `${Math.max(0, Math.min(value, 100))}%` }}
        />
      </div>
      <span className="w-8 min-w-8 text-right text-[12px] font-medium tabular-nums text-foreground">
        {value.toString().padStart(2, "0")}%
      </span>
    </div>
  );
}

export function DossiersTable({ rows }: { rows: DossierRow[] }) {
  const { t } = useLocale();
  const router = useRouter();

  return (
    <section className="flex min-h-0 flex-1 flex-col border-t border-border-soft bg-surface">
      <div className="shrink-0 px-6 pt-8">
        <Text as="h2" size={500} weight="semibold" className="text-[18px] leading-tight text-foreground">
          {t.dashboard.dossiers.title}
        </Text>
      </div>

      <div className="mb-4 flex shrink-0 items-center justify-between gap-4 px-6 pt-5">
        <Input
          className="h-9 w-full min-w-0 max-w-[420px] rounded border-border"
          placeholder={t.dashboard.dossiers.searchPlaceholder}
          contentBefore={
            <span className="pl-1 text-muted">
              <Search20Regular className="h-4 w-4" />
            </span>
          }
        />
        <Button
          appearance="outline"
          className="h-9 shrink-0 rounded border-border-strong text-[13px] text-secondary"
          icon={<Filter20Regular className="h-4 w-4 text-secondary" />}
        >
          {t.dashboard.dossiers.filterByRole}
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6">
        <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead className="sticky top-0 z-10 border-b border-border bg-surface text-left text-[13px] font-medium tracking-tight text-secondary">
            <tr>
              <th className="w-[30%] py-3 pl-3 pr-1 text-left">
                <span className="inline-flex items-center gap-1">
                  {t.dashboard.dossiers.organization}{" "}
                  <span className="text-[10px] font-normal opacity-80">↕</span>
                </span>
              </th>
              <th className="w-[30%] px-1 py-3 text-left">
                <span className="inline-flex items-center gap-1">
                  {t.dashboard.dossiers.dossier} <span className="text-[10px] font-normal opacity-80">↕</span>
                </span>
              </th>
              <th className="w-[20%] px-1 py-3 text-left">
                <span className="inline-flex items-center gap-1">
                  {t.dashboard.dossiers.roles} <span className="text-[10px] font-normal opacity-80">↕</span>
                </span>
              </th>
              <th className="w-[20%] py-3 pl-1 pr-8 text-right">
                <span className="inline-flex w-full items-center justify-end gap-1">
                  {t.dashboard.dossiers.progress} <span className="text-[10px] font-normal opacity-80">↕</span>
                </span>
              </th>
            </tr>
          </thead>
            <tbody>
            {rows.map((row) => {
              const href = hrefForDashboardDossierRow(row);
              return (
                <tr
                  key={row.id}
                  role="link"
                  tabIndex={0}
                  className="cursor-pointer border-b border-border-soft transition-colors last:border-0 hover:bg-surface-muted/80 focus:outline focus:outline-2 focus:outline-offset-[-1px] focus:outline-primary"
                  onClick={() => router.push(href)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(href);
                    }
                  }}
                >
                  <td className="py-3.5 pl-3 pr-1 text-[13px] font-medium text-foreground">{row.organization}</td>
                  <td className="px-1 py-3.5 text-[13px] text-secondary">{row.dossier}</td>
                  <td className="px-1 py-3.5">
                    <span
                      className={`inline-flex h-[22px] min-w-0 max-w-full items-center justify-center rounded px-2 text-[11px] font-semibold ${roleClass(row.role)}`}
                    >
                      {row.role}
                    </span>
                  </td>
                  <td className="px-1 py-3.5">
                    <ProgressCell value={row.progress} />
                  </td>
                </tr>
              );
            })}
            </tbody>
        </table>
        </div>
      </div>

      <div className="mt-auto flex shrink-0 items-center justify-end gap-0.5 border-t border-border-soft px-6 py-4 text-[13px] font-medium text-secondary">
        <button type="button" className="flex items-center gap-1 rounded px-2 py-1.5 hover:bg-sidebar hover:text-foreground">
          <span className="text-base leading-none">‹</span> {t.dashboard.pagination.previous}
        </button>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded text-foreground hover:bg-sidebar"
        >
          1
        </button>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded border border-primary font-semibold text-primary"
        >
          2
        </button>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded text-foreground hover:bg-sidebar"
        >
          3
        </button>
        <span className="px-2 text-foreground/70">…</span>
        <button type="button" className="flex items-center gap-1 rounded px-2 py-1.5 hover:bg-sidebar hover:text-foreground">
          {t.dashboard.pagination.next} <span className="text-base leading-none">›</span>
        </button>
      </div>
    </section>
  );
}
