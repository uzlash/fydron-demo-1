"use client";

import Image from "next/image";

export function FydronLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="Fydron"
      width={120}
      height={32}
      className={`h-8 w-auto object-contain ${className ?? ""}`.trim()}
      priority
    />
  );
}
