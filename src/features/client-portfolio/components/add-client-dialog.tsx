"use client";

import { useEffect, useState } from "react";
import { Button, Field, Input, Select } from "@fluentui/react-components";
import { useLocale } from "@/i18n/locale-context";

type AddClientDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function AddClientDialog({ open, onClose }: AddClientDialogProps) {
  const { t } = useLocale();
  const s1 = t.clientPortfolio.addClientStep1;
  const s2 = t.clientPortfolio.primaryContact;
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (open) setStep(1);
  }, [open]);

  if (!open) return null;

  return (
    <>
      <button type="button" aria-label="Close" className="fixed inset-0 z-40 bg-black/45" onClick={onClose} />
      <div
        className="fixed left-1/2 top-1/2 z-50 w-[min(480px,92vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[4px] border border-border bg-surface shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-client-dialog-title"
      >
        {step === 1 ? (
          <>
            <div className="px-6 pb-5 pt-5">
              <h2 id="add-client-dialog-title" className="text-[20px] font-semibold leading-tight text-foreground">
                {s1.title}
              </h2>
              <div className="mt-5 space-y-4">
                <Field label={s1.legalName} size="small" className="w-full">
                  <Input className="h-8 min-h-8" placeholder={s1.legalNamePlaceholder} size="small" />
                </Field>
                <Field label={s1.kvkNumber} size="small" className="w-full">
                  <Input className="h-8 min-h-8" placeholder={s1.numberPlaceholder} size="small" inputMode="numeric" />
                </Field>
                <Field label={s1.vatNumber} size="small" className="w-full">
                  <Input className="h-8 min-h-8" placeholder={s1.numberPlaceholder} size="small" />
                </Field>
                <Field label={s1.address} size="small" className="w-full">
                  <Input className="h-8 min-h-8" placeholder={s1.addressPlaceholder} size="small" />
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
                  <section>
                    <p className="mb-1.5 text-[13px] text-foreground">{s1.country}</p>
                    <Select className="h-8 w-full min-h-8 text-[13px]" defaultValue="">
                      <option value="">{s1.countryPlaceholder}</option>
                      <option value="nl">Netherlands</option>
                      <option value="be">Belgium</option>
                      <option value="de">Germany</option>
                    </Select>
                  </section>
                  <section>
                    <p className="mb-1.5 text-[13px] text-foreground">{s1.organisationType}</p>
                    <Select className="h-8 w-full min-h-8 text-[13px]" defaultValue="">
                      <option value="">{s1.orgTypePlaceholder}</option>
                      <option value="bv">BV</option>
                      <option value="nv">NV</option>
                      <option value="vof">VOF</option>
                    </Select>
                  </section>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border-soft px-6 py-3.5">
              <Button appearance="outline" className="h-8 min-h-8 rounded-[4px] px-4 text-[13px] font-medium" onClick={onClose}>
                {s1.cancel}
              </Button>
              <Button appearance="primary" className="h-8 min-h-8 rounded-[4px] px-4 text-[13px] font-medium" onClick={() => setStep(2)}>
                {s1.next}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="px-6 pb-5 pt-5">
              <h2 id="add-client-dialog-title" className="text-[20px] font-semibold leading-tight text-foreground">
                {s2.title}
              </h2>
              <div className="mt-5 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
                  <Field label={s2.firstName} size="small" className="w-full">
                    <Input className="h-8 min-h-8" placeholder={s2.firstNamePlaceholder} size="small" />
                  </Field>
                  <Field label={s2.lastName} size="small" className="w-full">
                    <Input className="h-8 min-h-8" placeholder={s2.lastNamePlaceholder} size="small" />
                  </Field>
                </div>
                <Field label={s2.email} size="small" className="w-full">
                  <Input className="h-8 min-h-8" type="email" placeholder={s2.emailPlaceholder} size="small" />
                </Field>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border-soft px-6 py-3.5">
              <Button appearance="outline" className="h-8 min-h-8 rounded-[4px] px-4 text-[13px] font-medium" onClick={() => setStep(1)}>
                {s2.back}
              </Button>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <Button appearance="primary" className="h-8 min-h-8 rounded-[4px] px-4 text-[13px] font-medium" onClick={onClose}>
                  {s2.addClient}
                </Button>
                <Button appearance="outline" className="h-8 min-h-8 rounded-[4px] px-4 text-[13px] font-medium" onClick={onClose}>
                  {s2.cancel}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
