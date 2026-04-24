"use client";

import type { ReactNode } from "react";
import { FydronLogo } from "@/features/auth/components/fydron-logo";

type Bg = "muted" | "black";

const bgClass: Record<Bg, string> = {
  muted: "bg-background",
  black: "bg-black",
};

export function AuthShell({
  children,
  footer,
  bg = "muted",
}: {
  children: ReactNode;
  footer?: ReactNode;
  bg?: Bg;
}) {
  return (
    <div
      className={`relative min-h-screen flex flex-col items-center justify-center px-4 py-12 ${bgClass[bg]}`}
    >
      <div className="flex w-full max-w-[362px] flex-col items-center gap-6">
        <FydronLogo className="shrink-0" />
        {children}
        {footer}
      </div>
    </div>
  );
}
