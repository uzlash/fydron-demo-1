"use client";

import { Button } from "@fluentui/react-components";
import { Warning16Filled } from "@fluentui/react-icons";
import { useLocale } from "@/i18n/locale-context";

type MatrixInspectionBannerProps = {
  onReviewUpgrade: () => void;
  onDismiss: () => void;
};

export function MatrixInspectionBanner({ onReviewUpgrade, onDismiss }: MatrixInspectionBannerProps) {
  const { t } = useLocale();

  return (
    <div className="flex w-full shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[#f5c6a8] bg-[#fff4e8] px-5 py-3 sm:px-6">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <Warning16Filled className="mt-0.5 shrink-0 text-[#d83b01]" />
        <p className="text-[13px] leading-relaxed text-[#5c2e00]">{t.matrix.dossier.inspection.bannerMessage}</p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
        <Button appearance="outline" className="h-8 rounded-[3px] border-[#c4c4c4] bg-white px-3 text-[13px] text-foreground" onClick={onReviewUpgrade}>
          {t.matrix.dossier.inspection.reviewUpgrade}
        </Button>
        <Button appearance="outline" className="h-8 rounded-[3px] border-[#c4c4c4] bg-white px-3 text-[13px] text-foreground" onClick={onDismiss}>
          {t.matrix.dossier.inspection.dismiss}
        </Button>
      </div>
    </div>
  );
}
