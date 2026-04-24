"use client";

import { CheckmarkCircle16Filled, DiamondDismiss16Filled, Warning16Filled } from "@fluentui/react-icons";
import type { PartnerAssetDocumentStatus } from "@/features/partner-assets/types";
import { useLocale } from "@/i18n/locale-context";

type PartnerAssetDocStatusCellProps = {
  status: PartnerAssetDocumentStatus;
};

export function PartnerAssetDocStatusCell({ status }: PartnerAssetDocStatusCellProps) {
  const { t } = useLocale();
  const s = t.partnerAssets.detail.documentStatus;

  if (status === "expiringSoon") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] text-foreground">
        <Warning16Filled className="text-[#ca5010]" />
        {s.expiringSoon}
      </span>
    );
  }

  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] text-foreground">
        <CheckmarkCircle16Filled className="text-success" />
        {s.approved}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-foreground">
      <DiamondDismiss16Filled className="text-danger" />
      {s.expired}
    </span>
  );
}
