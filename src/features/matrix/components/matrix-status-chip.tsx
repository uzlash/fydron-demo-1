"use client";

import { CheckmarkCircle16Filled, Circle16Regular, ArrowSync16Regular, Warning16Filled } from "@fluentui/react-icons";
import type { MatrixStatus } from "@/features/matrix/types";
import { useLocale } from "@/i18n/locale-context";

type MatrixStatusChipProps = {
  status: MatrixStatus;
};

export function MatrixStatusChip({ status }: MatrixStatusChipProps) {
  const { t } = useLocale();

  if (status === "reviewed") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] text-foreground">
        <CheckmarkCircle16Filled className="text-success" />
        {t.matrix.dossier.status.reviewed}
      </span>
    );
  }

  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] text-foreground">
        <CheckmarkCircle16Filled className="text-success" />
        {t.matrix.dossier.status.approved}
      </span>
    );
  }

  if (status === "awaitingReview") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] text-foreground">
        <ArrowSync16Regular className="text-primary" />
        {t.matrix.dossier.status.awaitingReview}
      </span>
    );
  }

  if (status === "notApproved") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] text-foreground">
        <Warning16Filled className="text-danger" />
        {t.matrix.dossier.status.notApproved}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-foreground">
      <Circle16Regular className="text-secondary" />
      {t.matrix.dossier.status.proofNeeded}
    </span>
  );
}
