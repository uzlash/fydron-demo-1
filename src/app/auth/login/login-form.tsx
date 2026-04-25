"use client";

import { Button, Field, Input } from "@fluentui/react-components";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { ErrorToast } from "@/features/auth/components/error-toast";
import { LegalFooter } from "@/features/auth/components/legal-footer";
import { PasswordInput } from "@/features/auth/components/password-input";
import { matchDemoUser } from "@/features/auth/demo-accounts";
import { useDemoSession } from "@/features/auth/demo-session-context";
import { useLocale } from "@/i18n/locale-context";

export function LoginForm() {
  const { t } = useLocale();
  const router = useRouter();
  const { signIn } = useDemoSession();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(errorParam);
  const [showToast, setShowToast] = useState(errorParam);

  useEffect(() => {
    setShowError(errorParam);
    setShowToast(errorParam);
  }, [errorParam]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setShowError(true);
      setShowToast(true);
      return;
    }
    const account = matchDemoUser(email, password);
    if (!account) {
      setShowError(true);
      setShowToast(true);
      return;
    }
    signIn(account);
    router.push("/dashboard");
  };

  return (
    <AuthShell footer={<LegalFooter />}>
      {showToast ? (
        <ErrorToast
          title={t.toast.loginErrorTitle}
          body={t.toast.loginErrorBody}
          onDismiss={() => setShowToast(false)}
        />
      ) : null}
      <AuthCard>
        <div className="flex flex-col gap-2">
          <h1 className="m-0 text-[18px] font-bold leading-tight text-foreground">
            {t.login.title}
          </h1>
          <p className="m-0 flex h-[20px] w-[314px] items-center font-['Segoe_UI'] text-[14px] font-normal leading-[20px] text-[#71717B] grow order-0">
            {t.login.subtitle}
          </p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={submit}>
          <Field
            className="[&_.fui-Field__label]:!mb-1 [&_.fui-Field__label]:font-['Segoe_UI'] [&_.fui-Field__label]:text-[14px] [&_.fui-Field__label]:font-normal [&_.fui-Field__label]:leading-[20px] [&_.fui-Field__label]:text-[#242424]"
            label={t.login.email}
            validationState={showError ? "error" : "none"}
          >
            <Input
              type="text"
              autoComplete="username"
              placeholder={t.login.emailPlaceholder}
              value={email}
              onChange={(_, d) => setEmail(d.value)}
            />
          </Field>
          <PasswordInput
            className="[&_.fui-Field__label]:!mb-2 [&_.fui-Field__label]:font-['Segoe_UI'] [&_.fui-Field__label]:text-[14px] [&_.fui-Field__label]:font-normal [&_.fui-Field__label]:leading-[20px] [&_.fui-Field__label]:text-[#242424]"
            label={t.login.password}
            labelEndSlot={
              <Link
                href="/auth/forgot-password"
                className="my-[-2px] inline-flex h-[20px] w-[110px] items-center font-['Segoe_UI'] text-[14px] font-normal leading-[20px] text-[#0060A9] underline"
              >
                {t.login.forgotPassword}
              </Link>
            }
            value={password}
            onChange={setPassword}
            validationState={showError ? "error" : "none"}
            placeholder="*****"
          />
          <Button
            appearance="primary"
            type="submit"
            className="inline-flex h-[32px] w-[314px] items-center justify-center gap-[6px] px-3 py-[6px] self-stretch !rounded-[4px] !bg-[#006EC3] text-white [&_.fui-Button__text]:!text-white [&_.fui-Button__icon]:!text-white"
          >
            <span className="flex h-[20px] w-[35px] items-center font-['Segoe_UI'] text-[14px] font-normal leading-[20px] text-white">
              {t.login.submit}
            </span>
          </Button>
          <p className="m-0 -mt-1 text-center text-[13px] leading-snug text-secondary">
            {t.login.noAccount}{" "}
            <Link href="/auth/create-password" className="font-medium text-primary underline">
              {t.login.signUp}
            </Link>
          </p>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
