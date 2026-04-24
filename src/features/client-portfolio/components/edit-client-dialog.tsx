"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Field, Input, Select } from "@fluentui/react-components";
import type { ClientProfile } from "@/features/client-portfolio/types";
import { useLocale } from "@/i18n/locale-context";

type EditStep = 1 | 2;

function splitDisplayName(full: string): { first: string; last: string } {
  const t = full.trim();
  if (!t) return { first: "", last: "" };
  const i = t.indexOf(" ");
  if (i === -1) return { first: t, last: "" };
  return { first: t.slice(0, i), last: t.slice(i + 1).trim() };
}

function toCountryCode(country: string): string {
  const c = country.toLowerCase();
  if (c.includes("netherlands") || c === "nl") return "nl";
  if (c.includes("belgium") || c === "be") return "be";
  if (c.includes("germany") || c === "de") return "de";
  return "nl";
}

function toOrgCode(org: string): string {
  const o = org.toLowerCase().trim();
  if (o === "enterprise" || o.includes("enterprise")) return "enterprise";
  if (o === "bv" || o.startsWith("bv ")) return "bv";
  if (o === "nv" || o.startsWith("nv ")) return "nv";
  if (o === "vof" || o.includes("vof")) return "vof";
  return "enterprise";
}

type EditClientDialogProps = {
  open: boolean;
  onClose: () => void;
  profile: ClientProfile | null;
};

const cancelButtonClass =
  "h-8 min-h-8 rounded-[4px] border !border-primary bg-surface px-4 text-[13px] font-medium !text-primary hover:bg-surface-muted";

export function EditClientDialog({ open, onClose, profile }: EditClientDialogProps) {
  const { t } = useLocale();
  const e = t.clientPortfolio.profile.editClient;
  const s1 = t.clientPortfolio.addClientStep1;
  const pc = t.clientPortfolio.primaryContact;
  const [step, setStep] = useState<EditStep>(1);

  const [legalName, setLegalName] = useState("");
  const [kvk, setKvk] = useState("");
  const [vat, setVat] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("nl");
  const [orgType, setOrgType] = useState("enterprise");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const resetFromProfile = useCallback(
    (p: ClientProfile) => {
      setStep(1);
      setLegalName(p.legal.legalName);
      setKvk(p.legal.kvkNumber);
      setVat(p.legal.vatNumber);
      setAddress(p.legal.address);
      setCountry(toCountryCode(p.legal.country));
      setOrgType(toOrgCode(p.legal.organisationType));
      const { first, last } = splitDisplayName(p.primaryContact.name);
      setFirstName(first);
      setLastName(last);
      setEmail(p.primaryContact.email);
    },
    [],
  );

  useEffect(() => {
    if (open && profile) {
      resetFromProfile(profile);
    }
  }, [open, profile, resetFromProfile]);

  if (!open || !profile) return null;

  return (
    <>
      <button type="button" aria-label="Close" className="fixed inset-0 z-40 bg-black/45" onClick={onClose} />
      <div
        className="fixed left-1/2 top-1/2 z-50 w-[min(480px,92vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[4px] border border-border bg-surface shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-client-dialog-title"
      >
        {step === 1 ? (
          <>
            <div className="px-6 pb-5 pt-5">
              <h2 id="edit-client-dialog-title" className="text-[20px] font-semibold leading-tight text-foreground">
                {e.step1Title}
              </h2>
              <div className="mt-5 space-y-4">
                <Field label={s1.legalName} size="small" className="w-full">
                  <Input
                    className="h-8 min-h-8"
                    size="small"
                    value={legalName}
                    onChange={(_, d) => setLegalName(d.value)}
                  />
                </Field>
                <Field label={s1.kvkNumber} size="small" className="w-full">
                  <Input
                    className="h-8 min-h-8"
                    size="small"
                    inputMode="numeric"
                    value={kvk}
                    onChange={(_, d) => setKvk(d.value)}
                  />
                </Field>
                <Field label={s1.vatNumber} size="small" className="w-full">
                  <Input className="h-8 min-h-8" size="small" value={vat} onChange={(_, d) => setVat(d.value)} />
                </Field>
                <Field label={s1.address} size="small" className="w-full">
                  <Input
                    className="h-8 min-h-8"
                    size="small"
                    value={address}
                    onChange={(_, d) => setAddress(d.value)}
                  />
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
                  <section>
                    <p className="mb-1.5 text-[13px] text-foreground">{s1.country}</p>
                    <Select
                      className="h-8 w-full min-h-8 text-[13px]"
                      value={country}
                      onChange={(_, d) => setCountry(String(d.value))}
                    >
                      <option value="nl">Netherlands</option>
                      <option value="be">Belgium</option>
                      <option value="de">Germany</option>
                    </Select>
                  </section>
                  <section>
                    <p className="mb-1.5 text-[13px] text-foreground">{s1.organisationType}</p>
                    <Select
                      className="h-8 w-full min-h-8 text-[13px]"
                      value={orgType}
                      onChange={(_, d) => setOrgType(String(d.value))}
                    >
                      <option value="enterprise">Enterprise</option>
                      <option value="bv">BV</option>
                      <option value="nv">NV</option>
                      <option value="vof">VOF</option>
                    </Select>
                  </section>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border-soft px-6 py-3.5">
              <Button appearance="outline" className={cancelButtonClass} onClick={onClose}>
                {e.cancel}
              </Button>
              <Button appearance="primary" className="h-8 min-h-8 rounded-[4px] px-4 text-[13px] font-medium" onClick={() => setStep(2)}>
                {e.continue}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="px-6 pb-5 pt-5">
              <h2 id="edit-client-dialog-title" className="text-[20px] font-semibold leading-tight text-foreground">
                {e.step2Title}
              </h2>
              <div className="mt-5 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
                  <Field label={pc.firstName} size="small" className="w-full">
                    <Input
                      className="h-8 min-h-8"
                      size="small"
                      value={firstName}
                      onChange={(_, d) => setFirstName(d.value)}
                    />
                  </Field>
                  <Field label={pc.lastName} size="small" className="w-full">
                    <Input
                      className="h-8 min-h-8"
                      size="small"
                      value={lastName}
                      onChange={(_, d) => setLastName(d.value)}
                    />
                  </Field>
                </div>
                <Field label={pc.email} size="small" className="w-full">
                  <Input
                    className="h-8 min-h-8"
                    type="email"
                    size="small"
                    value={email}
                    onChange={(_, d) => setEmail(d.value)}
                  />
                </Field>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border-soft px-6 py-3.5">
              <Button
                appearance="outline"
                className="h-8 min-h-8 rounded-[4px] border border-border bg-surface px-4 text-[13px] font-medium text-foreground"
                onClick={() => setStep(1)}
              >
                {e.back}
              </Button>
              <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
                <Button appearance="primary" className="h-8 min-h-8 rounded-[4px] px-4 text-[13px] font-medium" onClick={onClose}>
                  {e.saveChanges}
                </Button>
                <Button appearance="outline" className={cancelButtonClass} onClick={onClose}>
                  {e.cancel}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
