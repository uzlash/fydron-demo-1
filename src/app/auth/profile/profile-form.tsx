"use client";

import {
  Avatar,
  Button,
  Field,
  Input,
  Text,
} from "@fluentui/react-components";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { LegalFooter } from "@/features/auth/components/legal-footer";
import { useLocale } from "@/i18n/locale-context";

export function ProfileForm() {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const filled = searchParams.get("state") === "filled";

  const [first, setFirst] = useState(filled ? "Yuan" : "");
  const [last, setLast] = useState(filled ? "Lee" : "");
  const [phone, setPhone] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <AuthShell footer={<LegalFooter />}>
      <AuthCard>
        <div className="flex flex-col gap-2">
          <Text
            as="h1"
            size={500}
            weight="semibold"
            block
            className="text-foreground !text-lg leading-tight"
          >
            {t.profile.title}
          </Text>
          <Text
            size={300}
            className="text-sm leading-snug text-secondary"
          >
            {t.profile.subtitle}
          </Text>
        </div>
        <div className="flex flex-wrap items-start gap-4">
          <Avatar
            name={[first, last].filter(Boolean).join(" ").trim() || "User"}
            image={photoUrl ? { src: photoUrl } : undefined}
            size={120}
            shape="circular"
            color="colorful"
          />
          <div className="flex flex-col gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              aria-label={t.profile.uploadPhoto}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setPhotoUrl(URL.createObjectURL(f));
              }}
            />
            {photoUrl ? (
              <Button
                appearance="outline"
                onClick={() => {
                  setPhotoUrl(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
              >
                {t.profile.removePhoto}
              </Button>
            ) : (
              <Button
                appearance="outline"
                onClick={() => fileRef.current?.click()}
              >
                {t.profile.uploadPhoto}
              </Button>
            )}
            <Text size={200} className="text-secondary">
              {t.profile.photoHint}
            </Text>
          </div>
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            router.push("/auth/login");
          }}
        >
          <Field label={t.profile.firstName}>
            <Input value={first} onChange={(_, d) => setFirst(d.value)} />
          </Field>
          <Field label={t.profile.lastName}>
            <Input value={last} onChange={(_, d) => setLast(d.value)} />
          </Field>
          <Field label={t.profile.phone}>
            <Input
              type="tel"
              value={phone}
              onChange={(_, d) => setPhone(d.value)}
            />
          </Field>
          <Button
            appearance="primary"
            type="submit"
            className="w-full !rounded"
          >
            {t.profile.continue}
          </Button>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
