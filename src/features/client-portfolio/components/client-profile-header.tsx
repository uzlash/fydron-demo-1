"use client";

import { Button, Text } from "@fluentui/react-components";
import { CheckmarkCircle16Filled, Edit16Regular } from "@fluentui/react-icons";
import type { ClientProfile } from "@/features/client-portfolio/types";
import { useLocale } from "@/i18n/locale-context";

type ClientProfileHeaderProps = {
  profile: ClientProfile;
  onEdit: () => void;
};

export function ClientProfileHeader({ profile, onEdit }: ClientProfileHeaderProps) {
  const { t } = useLocale();
  const p = t.clientPortfolio.profile;

  return (
    <div className="mb-1 flex flex-col gap-4 sm:mb-0 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Text size={600} weight="semibold" className="text-[28px] leading-tight tracking-tight text-foreground">
            {profile.name}
          </Text>
          {profile.verified ? (
            <span className="text-success" title="Verified">
              <CheckmarkCircle16Filled className="h-5 w-5" />
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-[14px] leading-snug text-secondary">{profile.city}</p>
        <div className="mt-3 inline-flex">
          <span className="rounded-full border border-border bg-surface-muted px-2.5 py-0.5 text-[12px] font-medium text-secondary">
            {p.header.activeFrameworks.replace("{count}", String(profile.activeFrameworkCount))}
          </span>
        </div>
      </div>
      <Button
        appearance="outline"
        className="h-9 w-full shrink-0 rounded-[4px] border-border-strong sm:w-auto"
        icon={<Edit16Regular className="h-4 w-4" />}
        onClick={onEdit}
      >
        {p.header.edit}
      </Button>
    </div>
  );
}
