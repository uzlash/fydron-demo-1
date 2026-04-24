"use client";

import { Button, Text } from "@fluentui/react-components";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { useLocale } from "@/i18n/locale-context";

export function PasswordSuccessContent() {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dark = searchParams.get("theme") === "dark";

  const inner = (
    <AuthCard>
      <div className="flex flex-col gap-2">
        <Text
          as="h1"
          size={500}
          weight="semibold"
          block
          className="text-foreground !text-lg leading-tight"
        >
          {t.passwordSuccess.title}
        </Text>
        <Text
          size={300}
          className="text-sm leading-snug text-secondary"
        >
          {t.passwordSuccess.body}
        </Text>
      </div>
      <Button
        appearance="primary"
        className="w-full !rounded"
        onClick={() => router.push("/auth/mfa")}
      >
        {t.passwordSuccess.continueCta}
      </Button>
    </AuthCard>
  );

  if (dark) {
    return (
      <AuthShell bg="black" footer={null}>
        {inner}
      </AuthShell>
    );
  }

  return <AuthShell footer={null}>{inner}</AuthShell>;
}
