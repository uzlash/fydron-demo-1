"use client";

export function MatrixTableSkeleton() {
  return (
    <div className="mt-3 rounded-[6px] border border-border-soft">
      <div className="grid grid-cols-[26px_1.8fr_1.2fr_1.2fr_1.1fr_30px] gap-4 border-b border-border-soft px-3 py-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="h-4 animate-pulse rounded bg-surface-muted" />
        ))}
      </div>
      <div className="divide-y divide-border-soft">
        {Array.from({ length: 16 }).map((_, row) => (
          <div key={row} className="grid grid-cols-[26px_1.8fr_1.2fr_1.2fr_1.1fr_30px] gap-4 px-3 py-3">
            <div className="h-4 w-4 animate-pulse rounded-sm bg-surface-muted" />
            <div className="h-5 w-[70%] animate-pulse rounded bg-surface-muted" />
            <div className="h-5 w-[58%] animate-pulse rounded bg-surface-muted" />
            <div className="h-5 w-[38%] animate-pulse rounded bg-surface-muted" />
            <div className="h-5 w-[62%] animate-pulse rounded bg-surface-muted" />
            <div className="h-5 w-5 animate-pulse rounded bg-surface-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
