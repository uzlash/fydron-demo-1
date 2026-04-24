"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Field, Input, Spinner } from "@fluentui/react-components";
import {
  Dismiss20Regular,
  Document20Regular,
  Search20Regular,
} from "@fluentui/react-icons";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { DashboardTopbar } from "@/features/dashboard/components/dashboard-topbar";
import { NotificationCenter } from "@/features/dashboard/components/notification-center";
import { notificationItems } from "@/features/dashboard/mock-data";
import { useLocale } from "@/i18n/locale-context";
import { AppPageFrame, AppMainCard } from "@/components/app-content-shell";
import { RightDrawerFrame, RIGHT_DRAWER_WIDTH_440 } from "@/components/right-drawer-frame";

const SUGGESTED_CLIENTS_INITIAL = ["Facebook", "Coca cola", "Google", "Apple"];
const EXTRA_CLIENTS = ["Microsoft", "Amazon", "Acme Corp", "Wayne Enterprises"];

const YEARS = ["2026", "2025", "2024", "2023", "2022"];
const DOSSIERS = ["ISO 27001", "ISO 9001", "SOC 2", "VCA 201"];

type ExportPhase = "form" | "generating" | "complete";

export function ExportCenterScreen() {
  const { t } = useLocale();
  const x = t.exportCenter;
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [clientQuery, setClientQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [showMoreClients, setShowMoreClients] = useState(false);
  const [year, setYear] = useState("");
  const [dossier, setDossier] = useState("");
  const [phase, setPhase] = useState<ExportPhase>("form");
  const [progress, setProgress] = useState(0);

  const wrapRef = useRef<HTMLDivElement>(null);

  const suggestedList = useMemo(
    () => (showMoreClients ? [...SUGGESTED_CLIENTS_INITIAL, ...EXTRA_CLIENTS] : SUGGESTED_CLIENTS_INITIAL),
    [showMoreClients],
  );

  const filteredSuggestions = useMemo(() => {
    const q = clientQuery.trim().toLowerCase();
    if (!q) return suggestedList;
    return suggestedList.filter((name) => name.toLowerCase().includes(q));
  }, [clientQuery, suggestedList]);

  const displayClient = selectedClient ?? x.clientNamePlaceholder;

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setSuggestionsOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    if (phase !== "generating") return;
    setProgress(0);
    const start = Date.now();
    let doneTimeout: number | undefined;
    const id = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, Math.round((elapsed / 2200) * 100));
      setProgress(p);
      if (p >= 100) {
        window.clearInterval(id);
        doneTimeout = window.setTimeout(() => setPhase("complete"), 350);
      }
    }, 40);
    return () => {
      window.clearInterval(id);
      if (doneTimeout !== undefined) window.clearTimeout(doneTimeout);
    };
  }, [phase]);

  const canGenerate = Boolean(selectedClient && year && dossier) && phase === "form";

  const startGenerate = useCallback(() => {
    if (!selectedClient || !year || !dossier || phase !== "form") return;
    setPhase("generating");
  }, [dossier, phase, selectedClient, year]);

  const resetFlow = useCallback(() => {
    setPhase("form");
    setProgress(0);
    setShowMoreClients(false);
  }, []);

  const formDisabled = phase !== "form";

  return (
    <AppPageFrame>
      <DashboardSidebar />
      <AppMainCard>
      <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden">
        <DashboardTopbar
          title={x.title}
          onToggleNotifications={() => setIsNotificationCenterOpen((c) => !c)}
          hasUnreadNotifications={notificationItems.some((item) => item.unread)}
        />
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
          <div className="shrink-0 px-4 py-5 sm:px-6 sm:pt-6 sm:pb-0">
            <h1 className="text-[28px] font-semibold leading-tight text-foreground sm:text-[32px]">{x.heading}</h1>
            <p className="mt-2 max-w-[720px] text-[14px] leading-relaxed text-secondary">
              {x.description.replace("{client}", displayClient)}
            </p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          <div className="mt-0 max-w-[640px] space-y-5 sm:mt-0">
            <div ref={wrapRef} className="space-y-2">
              <p className="text-[13px] font-medium text-foreground">{x.client}</p>
              <div className="relative">
                <Input
                  className="h-9 w-full"
                  size="small"
                  placeholder={x.searchClient}
                  value={clientQuery}
                  onChange={(_, d) => setClientQuery(d.value)}
                  onFocus={() => setSuggestionsOpen(true)}
                  disabled={formDisabled}
                  contentBefore={<Search20Regular className="text-muted" />}
                  contentAfter={
                    clientQuery ? (
                      <button
                        type="button"
                        className="flex h-6 w-6 items-center justify-center text-secondary hover:text-foreground"
                        aria-label={x.clearSearch}
                        onClick={() => {
                          setClientQuery("");
                        }}
                      >
                        <Dismiss20Regular className="text-[14px]" />
                      </button>
                    ) : null
                  }
                />
                {suggestionsOpen && !formDisabled && !selectedClient && (
                  <div className="absolute left-0 right-0 z-20 mt-1 max-h-[280px] overflow-y-auto rounded-[2px] border border-border bg-surface py-1 shadow-md">
                    <p className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-wide text-muted">{x.suggested}</p>
                    {filteredSuggestions.length === 0 ? (
                      <p className="px-3 py-2 text-[13px] text-secondary">—</p>
                    ) : (
                      filteredSuggestions.map((name) => (
                        <button
                          key={name}
                          type="button"
                          className="block w-full px-3 py-2 text-left text-[13px] text-foreground hover:bg-surface-muted"
                          onClick={() => {
                            setSelectedClient(name);
                            setClientQuery("");
                            setSuggestionsOpen(false);
                          }}
                        >
                          {name}
                        </button>
                      ))
                    )}
                    {!showMoreClients ? (
                      <div className="border-t border-border-soft px-2 py-1.5">
                        <button
                          type="button"
                          className="text-left text-[13px] font-medium text-primary hover:underline"
                          onClick={() => setShowMoreClients(true)}
                        >
                          {x.showMore}
                        </button>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
              {selectedClient ? (
                <div className="inline-flex items-center gap-1.5 rounded-[4px] border border-border bg-surface-muted px-2.5 py-1.5 pr-1 text-[13px] text-foreground">
                  <span>{selectedClient}</span>
                  <button
                    type="button"
                    className="flex h-6 w-6 items-center justify-center rounded text-danger hover:bg-surface"
                    aria-label={x.removeClient.replace("{name}", selectedClient)}
                    onClick={() => {
                      setSelectedClient(null);
                    }}
                    disabled={formDisabled}
                  >
                    <Dismiss20Regular className="text-[14px]" />
                  </button>
                </div>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={x.year} className="min-w-0" size="small">
                <select
                  aria-label={x.year}
                  className="h-8 w-full min-w-0 rounded border border-border bg-surface px-2.5 text-[13px] text-foreground"
                  value={year}
                  disabled={formDisabled}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value="">{x.searchYear}</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={x.dossier} className="min-w-0" size="small">
                <select
                  aria-label={x.dossier}
                  className="h-8 w-full min-w-0 rounded border border-border bg-surface px-2.5 text-[13px] text-foreground"
                  value={dossier}
                  disabled={formDisabled}
                  onChange={(e) => setDossier(e.target.value)}
                >
                  <option value="">{x.selectDossier}</option>
                  {DOSSIERS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="flex gap-2 rounded-[2px] border border-[#fde7a9] bg-[#fff4ce] px-3.5 py-3 text-[12px] leading-relaxed text-[#5c4a00]">
              <Document20Regular className="mt-0.5 shrink-0 text-[#ca5010]" />
              <p>{x.infoBanner.replace("{client}", displayClient)}</p>
            </div>

            {phase === "form" ? (
              <div>
                <Button
                  appearance="primary"
                  className="h-9 min-w-[100px] rounded-[4px] px-4 text-[13px] font-medium"
                  disabled={!canGenerate}
                  onClick={startGenerate}
                >
                  {x.generate}
                </Button>
              </div>
            ) : null}

            {phase === "generating" ? (
              <div className="space-y-4">
                <Button appearance="primary" disabled className="h-9 rounded-[4px] px-4 text-[13px]">
                  <span className="inline-flex items-center gap-2">
                    <Spinner size="tiny" />
                    {x.generating}
                  </span>
                </Button>
                <div className="rounded-[4px] border border-border bg-surface p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2 text-[14px] font-semibold text-foreground">
                    <span>{x.buildingArchive}</span>
                    <span className="shrink-0 text-[#0b5c2e]">{progress}%</span>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-sm bg-surface-muted">
                    <div
                      className="h-full bg-[#00ca48] transition-[width] duration-200 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-2.5 flex items-center gap-2 text-[12px] text-[#0b5c2e]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00ca48]" aria-hidden />
                    {x.progressLabel}
                  </p>
                </div>
              </div>
            ) : null}

            {phase === "complete" ? (
              <div className="space-y-3 rounded-[4px] border-2 border-border-strong bg-surface p-4 shadow-sm">
                <h2 className="text-[16px] font-semibold text-foreground">
                  {x.archiveTitle.replace("{client}", selectedClient ?? displayClient)}
                </h2>
                <p className="text-[13px] leading-relaxed text-secondary">
                  {x.archiveBody.replace("{client}", selectedClient ?? displayClient)}
                </p>
                <button
                  type="button"
                  className="text-[13px] font-medium text-primary hover:underline"
                  onClick={resetFlow}
                >
                  {x.newReport}
                </button>
              </div>
            ) : null}
          </div>
          </div>
        </main>
      </div>
      </AppMainCard>

      {isNotificationCenterOpen ? (
        <>
          <button
            type="button"
            aria-label="Close notifications"
            className="absolute inset-0 z-20 bg-black/45"
            onClick={() => setIsNotificationCenterOpen(false)}
          />
          <RightDrawerFrame widthClass={RIGHT_DRAWER_WIDTH_440} zClass="z-30">
            <NotificationCenter items={notificationItems} />
          </RightDrawerFrame>
        </>
      ) : null}
    </AppPageFrame>
  );
}
