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
          <p className="m-0 text-sm font-normal leading-snug text-secondary">
            {t.login.subtitle}
          </p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={submit}>
          <Field
            className="[&_label]:text-foreground [&_label]:text-sm [&_label]:font-normal"
            label={t.login.email}
            validationState={showError ? "error" : "none"}
          >
            <Input
              type="email"
              placeholder={t.login.emailPlaceholder}
              value={email}
              onChange={(_, d) => setEmail(d.value)}
            />
          </Field>
          <PasswordInput
            className="[&_label]:text-foreground [&_label]:text-sm [&_label]:font-normal"
            label={t.login.password}
            labelEndSlot={
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary underline"
              >
                {t.login.forgotPassword}
              </Link>
            }
            value={password}
            onChange={setPassword}
            validationState={showError ? "error" : "none"}
          />
          <Button appearance="primary" type="submit" className="w-full !rounded">
            {t.login.submit}
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
