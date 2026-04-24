"use client";

import { useMemo, useState } from "react";
import {
  Input,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  SplitButton,
} from "@fluentui/react-components";
import type { MenuButtonProps } from "@fluentui/react-components";
import { Add16Regular, Search16Regular } from "@fluentui/react-icons";
import type { ClientPortfolioRow } from "@/features/client-portfolio/types";
import { useLocale } from "@/i18n/locale-context";

const PAGE_SIZE = 6;

function frameworkLabel(t: { oneFramework: string; nFrameworks: string }, count: number) {
  if (count === 1) return t.oneFramework;
  return t.nFrameworks.replace("{count}", String(count));
}

type ClientPortfolioTableProps = {
  rows: ClientPortfolioRow[];
  onSelectClient: (id: string) => void;
  onOpenAddClient: () => void;
};

export function ClientPortfolioTable({ rows, onSelectClient, onOpenAddClient }: ClientPortfolioTableProps) {
  const { t } = useLocale();
  const x = t.clientPortfolio;
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.name.toLowerCase().includes(q));
  }, [query, rows]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const currentPageRows = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  return (
    <section className="flex h-full min-h-0 flex-col px-5 pb-2 pt-4 sm:px-6">
        <div className="flex shrink-0 flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <div className="w-full min-w-0 sm:max-w-[min(100%,400px)]">
            <Input
              placeholder={x.searchClient}
              value={query}
              onChange={(_, d) => {
                setQuery(d.value);
                setPage(1);
              }}
              className="h-9 w-full"
              size="small"
              contentBefore={<Search16Regular className="text-muted" />}
            />
          </div>
          <div className="shrink-0 self-end sm:self-center">
            <Menu>
              <MenuTrigger disableButtonEnhancement>
                {(triggerProps: MenuButtonProps) => (
                  <SplitButton
                    appearance="primary"
                    className="h-9 font-medium"
                    icon={<Add16Regular />}
                    iconPosition="before"
                    menuButton={triggerProps}
                    primaryActionButton={{ onClick: onOpenAddClient }}
                    size="medium"
                  >
                    {x.new}
                  </SplitButton>
                )}
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem
                    onClick={onOpenAddClient}
                    icon={<Add16Regular className="text-foreground" />}
                  >
                    {x.addNewClient}
                  </MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
          </div>
        </div>

        <div className="mt-3 min-h-0 flex-1 overflow-y-auto">
          <div className="overflow-x-auto rounded-[4px] border border-border-soft">
          <table className="w-full border-collapse text-[13px]">
            <thead className="sticky top-0 z-10 bg-surface text-left text-secondary">
              <tr className="border-b border-border-soft">
                <th className="px-4 py-3 font-medium">
                  {x.table.client} ↕
                </th>
                <th className="px-4 py-3 font-medium">
                  {x.table.framework} ↕
                </th>
                <th className="px-4 py-3 font-medium">{x.table.averageProgress}</th>
              </tr>
            </thead>
            <tbody>
              {currentPageRows.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer border-b border-border-soft text-foreground last:border-b-0 hover:bg-surface-muted"
                  onClick={() => onSelectClient(row.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectClient(row.id);
                    }
                  }}
                  tabIndex={0}
                >
                  <td className="px-4 py-3 text-[14px] font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-[13px] text-secondary">
                    {frameworkLabel(x, row.frameworkCount)}
                  </td>
                  <td className="px-4 py-3 text-[13px]">{x.progressValue.replace("{value}", String(row.progress))}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        <div className="mt-4 flex shrink-0 flex-wrap items-center justify-end gap-1 border-t border-border-soft pt-3 text-[13px] text-secondary sm:gap-2">
          <button
            type="button"
            className="px-2 py-1 hover:text-foreground disabled:opacity-40"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            {x.pagination.previous}
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              className={`h-7 min-w-7 rounded px-1.5 ${
                n === safePage ? "border border-border bg-surface-muted text-foreground" : "hover:bg-surface-muted"
              }`}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            className="px-2 py-1 hover:text-foreground disabled:opacity-40"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            {x.pagination.next}
          </button>
        </div>
    </section>
  );
}
