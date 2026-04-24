"use client";

import type { ReactNode } from "react";

type FrameProps = {
  children: ReactNode;
};

/**
 * Full-viewport app row: gray background, sidebar is **not** inside the main card
 * (Fydron V2: sidebar on the base layer, main panel is a separate card).
 * Use for notifications/scrim that should cover the full shell — make this `relative`.
 */
export function AppPageFrame({ children }: FrameProps) {
  return (
    <div className="relative flex h-screen min-h-0 w-full min-w-0 overflow-hidden bg-background font-sans text-foreground">
      {children}
    </div>
  );
}

type MainCardProps = {
  children: ReactNode;
};

/**
 * 10px inset on the main column (top / right / bottom / gap from sidebar). Rounded
 * outline card contains header + page content only.
 */
export function AppMainCard({ children }: MainCardProps) {
  return (
    <div className="box-border flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-2.5">
      <div className="relative flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface">
        {children}
      </div>
    </div>
  );
}
