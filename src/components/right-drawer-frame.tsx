"use client";

import type { ReactNode } from "react";

export const RIGHT_DRAWER_WIDTH_360 = "w-[min(360px,calc(100vw-20px))] min-w-0 sm:w-[360px]";
export const RIGHT_DRAWER_WIDTH_440 = "w-[min(440px,calc(100vw-20px))] min-w-0 sm:w-[440px]";
export const RIGHT_DRAWER_WIDTH_420 = "w-[min(420px,calc(100vw-20px))] min-w-0 sm:w-[420px]";

type RightDrawerFrameProps = {
  children: ReactNode;
  widthClass: string;
  position?: "absolute" | "fixed";
  zClass?: string;
  vertical?: "inset" | "full";
};

export function RightDrawerFrame({
  children,
  widthClass,
  position = "absolute",
  zClass = "z-30",
  vertical = "inset",
}: RightDrawerFrameProps) {
  const pos = position === "fixed" ? "fixed" : "absolute";
  const v =
    vertical === "full"
      ? "top-0 right-0 bottom-0 border-y border-l border-border bg-surface shadow-[0_8px_32px_rgba(0,0,0,0.14)] rounded-none"
      : "top-2.5 right-2.5 bottom-2.5 rounded-none border border-border bg-surface shadow-[0_8px_32px_rgba(0,0,0,0.14)]";
  return (
    <div className={`${pos} ${zClass} flex min-h-0 flex-col overflow-hidden ${v} ${widthClass}`}>
      {children}
    </div>
  );
}
