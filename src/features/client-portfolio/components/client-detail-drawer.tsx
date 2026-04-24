"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@fluentui/react-components";
import { Dismiss20Regular, Archive20Regular, Eye20Regular } from "@fluentui/react-icons";
import type { ClientDetail, ClientDossier } from "@/features/client-portfolio/types";
import { useLocale } from "@/i18n/locale-context";
import { RightDrawerFrame, RIGHT_DRAWER_WIDTH_420 } from "@/components/right-drawer-frame";

type DrawerTab = "active" | "archived";

type ClientDetailDrawerProps = {
  open: boolean;
  detail: ClientDetail | null;
  onClose: () => void;
};

export function ClientDetailDrawer({ open, detail, onClose }: ClientDetailDrawerProps) {
  const { t } = useLocale();
  const router = useRouter();
  const d = t.clientPortfolio.drawer;
  const [tab, setTab] = useState<DrawerTab>("active");

  useEffect(() => {
    if (detail) setTab("active");
  }, [detail?.client.id]);

  if (!open || !detail) return null;

  const { client, dossiers } = detail;
  const activeDossiers = dossiers.filter((x) => !x.archived);
  const archivedDossiers = dossiers.filter((x) => x.archived);
  const list: ClientDossier[] = tab === "active" ? activeDossiers : archivedDossiers;

  return (
    <>
      <button
        type="button"
        aria-label="Close client drawer"
        className="fixed inset-0 z-40 bg-black/45"
        onClick={onClose}
      />
      <RightDrawerFrame widthClass={RIGHT_DRAWER_WIDTH_420} position="fixed" zClass="z-50" vertical="inset">
        <aside
          className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-surface"
          role="complementary"
          aria-labelledby="client-drawer-title"
        >
        <header className="flex items-start justify-between gap-3 border-b border-border-soft px-5 py-4">
          <h2 id="client-drawer-title" className="pr-2 text-[20px] font-semibold leading-snug text-foreground">
            {client.name}
          </h2>
          <button
            type="button"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border bg-surface text-secondary hover:bg-surface-muted"
            aria-label="Close"
            onClick={onClose}
          >
            <Dismiss20Regular />
          </button>
        </header>

        <div className="border-b border-border-soft px-5 pt-1">
          <div className="flex gap-6 text-[14px]">
            <button
              type="button"
              onClick={() => setTab("active")}
              className={
                tab === "active"
                  ? "border-b-2 border-primary pb-2.5 font-medium text-foreground"
                  : "border-b-2 border-transparent pb-2.5 text-secondary hover:text-foreground"
              }
            >
              {d.activeDossiers}
            </button>
            <button
              type="button"
              onClick={() => setTab("archived")}
              className={
                tab === "archived"
                  ? "border-b-2 border-primary pb-2.5 font-medium text-foreground"
                  : "border-b-2 border-transparent pb-2.5 text-secondary hover:text-foreground"
              }
            >
              {d.archivedDossiers}
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {tab === "active" && activeDossiers.length === 0 ? (
            <div className="flex flex-col items-center py-6 text-center">
              <p className="text-[14px] text-secondary">{d.emptyActive}</p>
              <Button appearance="primary" className="mt-4 h-9 min-h-9 rounded-[4px] px-4 text-[13px]">
                {d.startDossier}
              </Button>
            </div>
          ) : tab === "archived" && archivedDossiers.length === 0 ? (
            <p className="py-4 text-center text-[14px] text-secondary">{d.emptyArchived}</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {list.map((item) => (
                <li
                  key={item.id}
                  className="rounded-[4px] border border-border bg-surface p-4 shadow-sm"
                >
                  <p className="text-[15px] font-semibold text-foreground">{item.title}</p>
                  <p className={`mt-1 text-[12px] font-medium ${item.archived ? "text-secondary" : "text-success"}`}>
                    {item.archived ? d.archivedStatus : d.activeStatus}
                  </p>
                  {!item.archived ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        appearance="outline"
                        className="h-8 min-h-8 min-w-0 flex-1 rounded-[4px] border-border px-2 text-[12px] sm:min-w-[120px] sm:flex-none"
                        icon={<Eye20Regular className="h-4 w-4" />}
                        onClick={() => {
                          onClose();
                          router.push(`/client-portfolio/${client.id}/dossier/${item.id}`);
                        }}
                      >
                        {d.viewDossier}
                      </Button>
                      <Button
                        appearance="outline"
                        className="h-8 min-h-8 min-w-0 flex-1 rounded-[4px] border-border px-2 text-[12px] sm:min-w-[100px] sm:flex-none"
                        icon={<Archive20Regular className="h-4 w-4" />}
                      >
                        {d.archive}
                      </Button>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="shrink-0 border-t border-border-soft px-5 py-4">
          <Button
            appearance="outline"
            className="h-9 min-h-9 rounded-[4px] px-4 text-[13px]"
            onClick={() => {
              onClose();
              router.push(`/client-portfolio/${client.id}`);
            }}
          >
            {d.clientProfile}
          </Button>
        </footer>
        </aside>
      </RightDrawerFrame>
    </>
  );
}
