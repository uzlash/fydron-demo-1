"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DatePicker } from "@fluentui/react-datepicker-compat";
import {
  Button,
  Field,
  Input,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Select,
  SplitButton,
} from "@fluentui/react-components";
import type { MenuButtonProps } from "@fluentui/react-components";
import {
  Add16Regular,
  ArrowBidirectionalUpDown16Regular,
  Checkmark12Filled,
  Filter16Regular,
  Info16Regular,
  Search16Regular,
} from "@fluentui/react-icons";
import type { MatrixPortfolioRow } from "@/features/matrix/types";
import { MATRIX_ACTIVATION_DOSSIER_ID, MATRIX_ACTIVATION_QUERY_KEY } from "@/features/matrix/types";
import { MatrixUserManagementModal } from "@/features/matrix/components/matrix-user-management-modal";
import { hrefForMatrixPortfolioRow } from "@/lib/dossier-demo-hrefs";
import { useLocale } from "@/i18n/locale-context";

const PAGE_SIZE = 12;

type ActivateStep = 1 | 2;
type Workflow = "standard" | "direct";

/** Figma Matrix / Audit Portfolio role chips */
function roleClass(role: MatrixPortfolioRow["role"]) {
  switch (role) {
    case "Admin":
      return "bg-[#f3f2f1] text-[#323130]";
    case "Auditor":
      return "bg-[#0078d4] text-white";
    case "Reviewer":
      return "bg-[#323130] text-white";
    case "Contributor":
    case "User":
      return "bg-[#fde7e9] text-[#a4262c]";
    default:
      return "bg-border-soft text-secondary";
  }
}

function roleLabel(
  role: MatrixPortfolioRow["role"],
  contributor: string,
): string {
  if (role === "User" || role === "Contributor") return contributor;
  return role;
}

type ActivateDossierDialogProps = {
  open: boolean;
  onClose: () => void;
};

type DialogPhase = "wizard" | "success";

function ActivateDossierDialog({ open, onClose }: ActivateDossierDialogProps) {
  const { t } = useLocale();
  const router = useRouter();
  const [phase, setPhase] = useState<DialogPhase>("wizard");
  const [step, setStep] = useState<ActivateStep>(1);
  const [workflow, setWorkflow] = useState<Workflow>("standard");
  const [auditDate, setAuditDate] = useState<Date | null>(null);

  useEffect(() => {
    if (open) {
      setPhase("wizard");
      setStep(1);
      setWorkflow("standard");
      setAuditDate(null);
    }
  }, [open]);

  if (!open) return null;

  const openMatrix = () => {
    const path = `/matrix/${MATRIX_ACTIVATION_DOSSIER_ID}?${MATRIX_ACTIVATION_QUERY_KEY}=${encodeURIComponent(workflow)}`;
    onClose();
    router.push(path);
  };

  if (phase === "success") {
    return (
      <>
        <button type="button" aria-label="Close" className="fixed inset-0 z-40 bg-black/45" onClick={onClose} />
        <div
          className="fixed left-1/2 top-1/2 z-50 w-[min(400px,92vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[4px] border border-border bg-surface shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="matrix-activate-success-title"
        >
          <div className="px-6 pb-2 pt-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#00ca48]">
              <Checkmark12Filled className="text-white" />
            </div>
            <h3 id="matrix-activate-success-title" className="text-[20px] font-normal leading-snug text-foreground">
              {t.matrix.portfolio.activateDialog.successTitle}
              <br />
              {t.matrix.portfolio.activateDialog.successSubtitle}
            </h3>
          </div>
          <div className="border-t border-border-soft px-6 py-3.5">
            <div className="flex justify-end">
              <Button appearance="primary" className="h-8 min-h-8 rounded-[4px] px-4 text-[13px] font-medium" onClick={openMatrix}>
                {t.matrix.portfolio.activateDialog.openMatrix}
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <button type="button" aria-label="Close activate dossier dialog" className="fixed inset-0 z-40 bg-black/45" onClick={onClose} />
      <div
        className={
          step === 1
            ? "fixed left-1/2 top-1/2 z-50 w-[min(480px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-[4px] border border-border bg-surface shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
            : "fixed left-1/2 top-1/2 z-50 w-[min(720px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-[4px] border border-border bg-surface shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby="matrix-activate-dossier-title"
      >
        {step === 1 ? (
          <>
            <div className="px-6 pb-5 pt-5">
              <h3 id="matrix-activate-dossier-title" className="text-[20px] font-normal leading-tight text-foreground">
                {t.matrix.portfolio.activateDialog.title}
              </h3>

              <section className="mt-5">
                <p className="mb-1.5 text-[13px] text-foreground">{t.matrix.portfolio.activateDialog.selectOrganization}</p>
                <Select className="h-8 w-full min-h-8 text-[13px]" defaultValue="">
                  <option value="">{t.matrix.portfolio.activateDialog.chooseClient}</option>
                  <option value="acme">Acme Corporation</option>
                  <option value="wayne">Wayne Enterprises</option>
                  <option value="stark">Stark Industries</option>
                </Select>
              </section>

              <Field
                label={t.matrix.portfolio.activateDialog.dossierName}
                size="small"
                className="mt-4 w-full min-w-0"
              >
                <Input
                  className="h-8 min-h-8 w-full min-w-0 text-[13px] [&>input]:min-w-0"
                  placeholder={t.matrix.portfolio.activateDialog.enterDossierName}
                  size="small"
                />
              </Field>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
                <section>
                  <p className="mb-1.5 text-[13px] text-foreground">{t.matrix.portfolio.activateDialog.selectFramework}</p>
                  <Select className="h-8 w-full min-h-8 text-[13px]" defaultValue="">
                    <option value="">{t.matrix.portfolio.activateDialog.chooseFramework}</option>
                    <option value="iso27001">ISO 27001</option>
                    <option value="iso9001">ISO 9001</option>
                    <option value="soc2">SOC 2</option>
                  </Select>
                </section>
                <Field label={t.matrix.portfolio.activateDialog.auditName} size="small" className="w-full">
                  {(fieldControlProps) => (
                    <DatePicker
                      {...fieldControlProps}
                      className="w-full min-w-0"
                      placeholder={t.matrix.portfolio.activateDialog.searchDate}
                      value={auditDate}
                      onSelectDate={(d) => setAuditDate(d ?? null)}
                      showGoToToday
                      positioning={{ position: "below" }}
                    />
                  )}
                </Field>
              </div>
            </div>

            <div className="flex flex-row-reverse flex-wrap items-center justify-start gap-2 border-t border-border-soft px-6 py-3.5">
              <Button appearance="outline" className="h-8 min-h-8 rounded-[4px] px-4 text-[13px] font-medium" onClick={onClose}>
                {t.matrix.portfolio.activateDialog.cancel}
              </Button>
              <Button appearance="primary" className="h-8 min-h-8 rounded-[4px] px-4 text-[13px] font-medium" onClick={() => setStep(2)}>
                {t.matrix.portfolio.activateDialog.continue}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="px-6 pb-5 pt-5">
              <h3 id="matrix-activate-dossier-title" className="text-[20px] font-normal leading-tight text-foreground">
                {t.matrix.portfolio.activateDialog.title}
              </h3>
              <p className="mt-1.5 text-[13px] text-secondary">{t.matrix.portfolio.activateDialog.chooseWorkflow}</p>

              <section className="mt-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setWorkflow("standard")}
                    className={`overflow-hidden rounded-[4px] border bg-surface text-left transition-colors ${
                      workflow === "standard" ? "border-primary ring-1 ring-primary" : "border-border-soft"
                    }`}
                  >
                    <div className="px-4 py-3.5">
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
                            workflow === "standard" ? "border-primary" : "border-foreground/40"
                          }`}
                          aria-hidden
                        >
                          {workflow === "standard" ? <span className="h-2.5 w-2.5 rounded-full bg-primary" /> : null}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[14px] font-semibold text-foreground">{t.matrix.portfolio.activateDialog.standardUnit}</p>
                          <p className="mt-1 text-[12px] leading-relaxed text-secondary">{t.matrix.portfolio.activateDialog.standardSubtitle}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 border-t border-border-soft bg-surface-muted px-4 py-2 text-[12px] text-foreground">
                      <Info16Regular className="shrink-0 text-secondary" />
                      {t.matrix.portfolio.activateDialog.fullReviewProcess}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWorkflow("direct")}
                    className={`overflow-hidden rounded-[4px] border bg-surface text-left transition-colors ${
                      workflow === "direct" ? "border-primary ring-1 ring-primary" : "border-border-soft"
                    }`}
                  >
                    <div className="px-4 py-3.5">
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
                            workflow === "direct" ? "border-primary" : "border-foreground/40"
                          }`}
                          aria-hidden
                        >
                          {workflow === "direct" ? <span className="h-2.5 w-2.5 rounded-full bg-primary" /> : null}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[14px] font-semibold text-foreground">{t.matrix.portfolio.activateDialog.directAuditor}</p>
                          <p className="mt-1 text-[12px] leading-relaxed text-secondary">{t.matrix.portfolio.activateDialog.directSubtitle}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 border-t border-border-soft bg-surface-muted px-4 py-2 text-[12px] text-foreground">
                      <Info16Regular className="shrink-0 text-secondary" />
                      {t.matrix.portfolio.activateDialog.immediateReady}
                    </div>
                  </button>
                </div>
              </section>
            </div>

            <div className="flex flex-row-reverse flex-wrap items-center justify-start gap-2 border-t border-border-soft px-6 py-3.5">
              <Button appearance="outline" className="h-8 min-h-8 rounded-[4px] px-4 text-[13px] font-medium" onClick={() => setStep(1)}>
                {t.matrix.portfolio.activateDialog.back}
              </Button>
              <Button appearance="primary" className="h-8 min-h-8 rounded-[4px] px-4 text-[13px] font-medium" onClick={() => setPhase("success")}>
                {t.matrix.portfolio.activateDialog.activateDossier}
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

type MatrixPortfolioTableProps = {
  rows: MatrixPortfolioRow[];
};

export function MatrixPortfolioTable({ rows }: MatrixPortfolioTableProps) {
  const { t } = useLocale();
  const router = useRouter();
  const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const currentPageRows = rows.slice(0, PAGE_SIZE);

  return (
    <>
      <section className="flex h-full min-h-0 flex-col px-6 pb-6 pt-6">
        <h2 className="shrink-0 text-[18px] font-normal leading-normal text-foreground">
          {t.matrix.portfolio.title}
        </h2>

        <div className="mt-5 flex shrink-0 flex-wrap items-center justify-between gap-3">
          <Input
            className="h-9 w-full min-w-0 max-w-[360px] rounded-md border border-border-soft bg-surface"
            placeholder={t.matrix.portfolio.searchPlaceholder}
            size="small"
            contentBefore={<Search16Regular className="text-muted" />}
          />
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Button
              appearance="outline"
              className="h-9 min-h-9 rounded-md border-border px-3 text-[13px] font-semibold text-foreground"
              icon={<Filter16Regular className="text-foreground" />}
            >
              {t.matrix.portfolio.filterByRole}
            </Button>

            <Menu positioning="below-end">
              <MenuTrigger disableButtonEnhancement>
                {(triggerProps: MenuButtonProps) => (
                  <div
                    className="inline-flex rounded-md [&_button]:!border-[#0078d4] [&_button]:!bg-[#0078d4] [&_button]:!text-white [&_button:hover]:!bg-[#106ebe] [&_button:hover]:!border-[#106ebe] [&_button:disabled]:!opacity-100"
                  >
                    <SplitButton
                      appearance="primary"
                      className="h-9 min-h-9 rounded-md text-[13px] font-semibold"
                      icon={<Add16Regular />}
                      iconPosition="before"
                      menuButton={triggerProps}
                      primaryActionButton={{ onClick: () => setIsActivateDialogOpen(true) }}
                      size="medium"
                    >
                      {t.matrix.portfolio.new}
                    </SplitButton>
                  </div>
                )}
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem onClick={() => setIsActivateDialogOpen(true)}>{t.matrix.portfolio.actions.activateNewDossier}</MenuItem>
                  <MenuItem onClick={() => setIsUserManagementOpen(true)}>{t.matrix.portfolio.actions.userManagement}</MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
          </div>
        </div>

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
          <div className="overflow-x-auto rounded-md border border-border-soft">
            <table className="w-full border-collapse text-[13px]">
              <thead className="sticky top-0 z-10 border-b border-border-soft bg-surface text-left">
                <tr>
                  <th className="px-4 py-3.5 pr-2 text-[12px] font-semibold capitalize text-secondary">
                    <span className="inline-flex items-center gap-1.5">
                      {t.matrix.portfolio.columns.dossier}
                      <ArrowBidirectionalUpDown16Regular
                        className="h-3.5 w-3.5 shrink-0 text-muted"
                        aria-hidden
                      />
                    </span>
                  </th>
                  <th className="px-4 py-3.5 pr-2 text-[12px] font-semibold capitalize text-secondary">
                    <span className="inline-flex items-center gap-1.5">
                      {t.matrix.portfolio.columns.framework}
                      <ArrowBidirectionalUpDown16Regular
                        className="h-3.5 w-3.5 shrink-0 text-muted"
                        aria-hidden
                      />
                    </span>
                  </th>
                  <th className="px-4 py-3.5 pr-2 text-[12px] font-semibold capitalize text-secondary">
                    <span className="inline-flex items-center gap-1.5">
                      {t.matrix.portfolio.columns.roles}
                      <ArrowBidirectionalUpDown16Regular
                        className="h-3.5 w-3.5 shrink-0 text-muted"
                        aria-hidden
                      />
                    </span>
                  </th>
                  <th className="px-4 py-3.5 pr-2 text-[12px] font-semibold capitalize text-secondary">
                    <span className="inline-flex items-center gap-1.5">
                      {t.matrix.portfolio.columns.progress}
                      <ArrowBidirectionalUpDown16Regular
                        className="h-3.5 w-3.5 shrink-0 text-muted"
                        aria-hidden
                      />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPageRows.map((row) => {
                  const href = hrefForMatrixPortfolioRow(row);
                  return (
                    <tr
                      key={row.id}
                      role="link"
                      tabIndex={0}
                      className="cursor-pointer border-b border-border-soft text-foreground last:border-b-0 hover:bg-surface-muted/80 focus:outline focus:outline-2 focus:outline-offset-[-1px] focus:outline-primary"
                      onClick={() => router.push(href)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          router.push(href);
                        }
                      }}
                    >
                      <td className="px-4 py-3.5 text-[14px] font-normal text-foreground">
                        {row.organization}
                      </td>
                      <td className="px-4 py-3.5 text-[13px] text-secondary">{row.framework}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex h-[22px] items-center rounded px-2 text-[11px] font-semibold leading-none ${roleClass(row.role)}`}
                        >
                          {roleLabel(row.role, t.matrix.portfolio.roleContributor)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-[13px] text-foreground">{row.progress}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex shrink-0 items-center justify-end gap-1 border-t border-border-soft pt-4 text-[13px] text-secondary">
          <button type="button" className="px-2 py-1.5 text-foreground/80 hover:text-foreground">
            {t.matrix.portfolio.paginationPrevious}
          </button>
          <div className="mx-0.5 flex items-center gap-0.5">
            <button
              type="button"
              className="inline-flex h-8 min-w-8 items-center justify-center rounded px-2 text-foreground/90 hover:bg-[#f3f2f1]"
            >
              1
            </button>
            <button
              type="button"
              className="inline-flex h-8 min-w-8 items-center justify-center rounded bg-[#edebe9] px-2 font-medium text-foreground"
              aria-current="page"
            >
              2
            </button>
            <button
              type="button"
              className="inline-flex h-8 min-w-8 items-center justify-center rounded px-2 text-foreground/90 hover:bg-[#f3f2f1]"
            >
              3
            </button>
            <span className="px-1" aria-hidden>
              ...
            </span>
          </div>
          <button type="button" className="px-2 py-1.5 text-foreground/80 hover:text-foreground">
            {t.matrix.portfolio.paginationNext}
          </button>
        </div>
      </section>

      <ActivateDossierDialog open={isActivateDialogOpen} onClose={() => setIsActivateDialogOpen(false)} />
      <MatrixUserManagementModal open={isUserManagementOpen} onClose={() => setIsUserManagementOpen(false)} />
    </>
  );
}
