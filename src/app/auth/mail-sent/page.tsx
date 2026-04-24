"use client";

import { Text } from "@fluentui/react-components";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { useLocale } from "@/i18n/locale-context";

export default function MailSentPage() {
  const { t } = useLocale();

  return (
    <AuthShell>
      <AuthCard>
        <div className="flex flex-col gap-2">
          <Text
            as="h1"
            size={500}
            weight="semibold"
            block
            className="text-foreground !text-lg leading-tight"
          >
            {t.mailSent.title}
          </Text>
          <Text
            size={300}
            className="text-sm leading-snug text-secondary"
          >
            {t.mailSent.body}
          </Text>
        </div>
      </AuthCard>
    </AuthShell>
  );
}
