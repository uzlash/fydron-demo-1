"use client";

import { Info16Regular } from "@fluentui/react-icons";
import { useLocale } from "@/i18n/locale-context";

export function MatrixUnderReviewBanner() {
  const { t } = useLocale();

  return (
    <div className="flex w-full shrink-0 items-start gap-3 border-b border-border bg-[#f3f2f1] px-5 py-3 sm:px-6">
      <Info16Regular className="mt-0.5 shrink-0 text-secondary" />
      <p className="text-[13px] leading-relaxed text-foreground">{t.matrix.dossier.underReview.bannerMessage}</p>
    </div>
  );
}
