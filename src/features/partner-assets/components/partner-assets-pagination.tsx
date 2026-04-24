"use client";

type PageToken = number | "ellipsis";

function pageTokens(totalPages: number, current: number): PageToken[] {
  const safe = Math.max(1, Math.min(current, totalPages));
  if (totalPages <= 1) {
    return [1];
  }
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (safe <= 3) {
    return [1, 2, 3, "ellipsis", totalPages];
  }
  if (safe >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "ellipsis", safe - 1, safe, safe + 1, "ellipsis", totalPages];
}

type PartnerAssetsPaginationProps = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  previousLabel: string;
  nextLabel: string;
};

export function PartnerAssetsPagination({
  totalPages,
  currentPage,
  onPageChange,
  previousLabel,
  nextLabel,
}: PartnerAssetsPaginationProps) {
  const safe = Math.max(1, Math.min(currentPage, totalPages));
  const items = pageTokens(totalPages, safe);

  return (
    <div className="flex flex-wrap items-center justify-end gap-1 text-[13px] text-secondary sm:gap-2">
      <button
        type="button"
        className="px-2 py-1 hover:text-foreground disabled:opacity-40"
        disabled={safe <= 1}
        onClick={() => onPageChange(Math.max(1, safe - 1))}
      >
        {previousLabel}
      </button>
      {items.map((token, idx) =>
        token === "ellipsis" ? (
          <span key={`e-${idx}`} className="px-0.5">
            …
          </span>
        ) : (
          <button
            key={token}
            type="button"
            className={`h-7 min-w-7 rounded px-1.5 ${
              token === safe ? "border border-border bg-surface-muted text-foreground" : "hover:bg-surface-muted"
            }`}
            onClick={() => onPageChange(token)}
          >
            {token}
          </button>
        ),
      )}
      <button
        type="button"
        className="px-2 py-1 hover:text-foreground disabled:opacity-40"
        disabled={safe >= totalPages}
        onClick={() => onPageChange(Math.min(totalPages, safe + 1))}
      >
        {nextLabel}
      </button>
    </div>
  );
}
