"use client";

import { Button, Text } from "@fluentui/react-components";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { useLocale } from "@/i18n/locale-context";

const QR_CODE_SRC = "/qr-code-test.png";

export default function MfaPage() {
  const { t } = useLocale();
  const router = useRouter();

  return (
    <AuthShell footer={null}>
      <AuthCard>
        <div className="flex flex-col gap-2">
          <Text
            as="h1"
            size={500}
            weight="semibold"
            block
            className="text-foreground !text-lg leading-tight"
          >
            {t.mfa.title}
          </Text>
          <Text
            size={300}
            className="text-sm leading-snug text-secondary"
          >
            {t.mfa.subtitle}
          </Text>
        </div>
        <div className="flex justify-center py-8">
          <Image
            src={QR_CODE_SRC}
            alt=""
            width={200}
            height={200}
            className="h-[200px] w-[200px] max-w-full object-contain"
            priority
          />
        </div>
        <Text
          size={200}
          className="text-center text-sm text-muted"
        >
          {t.mfa.scanHint}
        </Text>
        <Button
          appearance="primary"
          className="w-full !rounded"
          onClick={() => router.push("/auth/profile")}
        >
          {t.mfa.continueToProfile}
        </Button>
      </AuthCard>
    </AuthShell>
  );
}
