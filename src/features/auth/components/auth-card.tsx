"use client";

import type { ReactNode } from "react";

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-[362px] rounded-md border border-[var(--Neutral-Stroke-1-Pressed,_#B3B3B3)] bg-surface">
      <div className="flex flex-col gap-6 p-6">{children}</div>
    </div>
  );
}
