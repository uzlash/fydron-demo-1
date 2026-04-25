"use client";

import { Button, Spinner, Text } from "@fluentui/react-components";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { ErrorToast } from "@/features/auth/components/error-toast";
import { LegalFooter } from "@/features/auth/components/legal-footer";
import { PasswordInput } from "@/features/auth/components/password-input";
import { useLocale } from "@/i18n/locale-context";
import { meetsPasswordRequirements } from "@/utils/helpers";

export function CreatePasswordForm() {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mismatchPreview = searchParams.get("mismatch") === "1";

  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [showError, setShowError] = useState(mismatchPreview);
  const [showToast, setShowToast] = useState(mismatchPreview);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setShowError(mismatchPreview);
    setShowToast(mismatchPreview);
  }, [mismatchPreview]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (a !== b || !meetsPasswordRequirements(a)) {
      setShowError(true);
      setShowToast(true);
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      router.push("/auth/password-success");
    }, 1500);
  };

  return (
    <AuthShell footer={<LegalFooter />}>
      {showToast ? (
        <ErrorToast
          title={t.toast.passwordMismatchTitle}
          body={t.toast.passwordMismatchBody}
          onDismiss={() => setShowToast(false)}
        />
      ) : null}
      <AuthCard>
        <div className="flex flex-col gap-2">
          <Text
            as="h1"
            size={500}
            weight="semibold"
            block
            className="text-foreground !text-lg leading-tight"
          >
            {t.createPassword.title}
          </Text>
          <Text
            size={300}
            className="flex h-[20px] w-[314px] items-center font-['Segoe_UI'] text-[14px] font-normal leading-[20px] text-[#71717B] grow order-0"
          >
            {t.createPassword.subtitle}
          </Text>
        </div>
        <form className="flex flex-col gap-6" onSubmit={submit}>
          <div className="flex flex-col gap-4">
            <PasswordInput
              className="[&_label]:h-[20px] [&_label]:font-['Segoe_UI'] [&_label]:text-[14px] [&_label]:font-normal [&_label]:leading-[20px] [&_label]:text-[#242424]"
              label={t.createPassword.newPassword}
              value={a}
              onChange={setA}
              validationState={showError ? "error" : "none"}
              placeholder={t.createPassword.placeholder}
            />
            <PasswordInput
              className="[&_label]:h-[20px] [&_label]:font-['Segoe_UI'] [&_label]:text-[14px] [&_label]:font-normal [&_label]:leading-[20px] [&_label]:text-[#242424]"
              label={t.createPassword.confirmPassword}
              value={b}
              onChange={setB}
              validationState={showError ? "error" : "none"}
              placeholder={t.createPassword.placeholder}
            />
          </div>
          <div>
            <Text
              size={200}
              weight="semibold"
              block
              className="mb-1 text-sm text-body"
            >
              {t.createPassword.requirementsTitle}
            </Text>
            <ul className="list-disc space-y-0.5 pl-5 text-sm leading-normal text-secondary">
              <li>{t.createPassword.req1}</li>
              <li>{t.createPassword.req2}</li>
              <li>{t.createPassword.req3}</li>
              <li>{t.createPassword.req4}</li>
            </ul>
          </div>
          <Button
            appearance="primary"
            type="submit"
            className="w-full !rounded"
            disabled={loading}
          >
            {loading ? <Spinner size="tiny" className="text-primary-foreground" /> : t.createPassword.submit}
          </Button>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
