"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Avatar, Popover, PopoverSurface, PopoverTrigger, Text } from "@fluentui/react-components";
import {
  ChevronRight20Regular,
  Database20Regular,
  Headphones20Regular,
  Settings20Regular,
  SignOut20Regular,
  WeatherSunny20Regular,
} from "@fluentui/react-icons";
import { useDemoSession } from "@/features/auth/demo-session-context";
import { useLocale } from "@/i18n/locale-context";

type MenuRowProps = {
  icon: ReactNode;
  label: string;
  destructive?: boolean;
  href?: string;
  onClick?: () => void;
  onNavigate?: () => void;
};

function MenuRow({ icon, label, destructive, href, onClick, onNavigate }: MenuRowProps) {
  const rowClass =
    "group flex w-full min-h-10 max-w-full items-center gap-3 rounded-lg p-1 text-left text-[14px] font-medium leading-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary";

  const stateClass = destructive
    ? "text-accent-foreground hover:bg-accent/10"
    : "text-foreground hover:bg-surface-muted";

  const content = (
    <>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center [&_svg]:h-5 [&_svg]:w-5 ${
          destructive ? "text-accent-foreground" : "text-foreground"
        }`}
        aria-hidden
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <ChevronRight20Regular
        className="h-4 w-4 shrink-0 text-secondary"
        aria-hidden
      />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${rowClass} ${stateClass}`} onClick={onNavigate}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={`${rowClass} ${stateClass}`} onClick={onClick}>
      {content}
    </button>
  );
}

type SidebarProfileMenuProps = {
  name: string;
  email: string;
};

export function SidebarProfileMenu({ name, email }: SidebarProfileMenuProps) {
  const { t } = useLocale();
  const { signOut } = useDemoSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  return (
    <Popover
      open={open}
      onOpenChange={(_, data) => setOpen(data.open)}
      positioning={{ position: "after", align: "start", offset: { mainAxis: 10, crossAxis: 0 } }}
    >
      <PopoverTrigger disableButtonEnhancement>
        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-[10px] rounded-lg border border-transparent px-1 py-1 text-left outline-none transition-colors hover:bg-border-soft focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <Avatar name={name} color="colorful" size={32} />
          <div className="min-w-0 flex flex-1 flex-col justify-center gap-[2px]">
            <Text size={300} block className="text-[13px] font-normal leading-tight text-foreground"> 
              {name}
            </Text>
            <Text size={200} block className="truncate text-[11px] leading-tight text-secondary">
              {email}
            </Text>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverSurface className="min-w-[272px] overflow-hidden rounded-[20px] border border-border bg-surface shadow-[0_4px_24px_rgba(0,0,0,0.1)] sm:min-w-[280px]">
        <nav className="flex flex-col gap-0.5" aria-label={t.settings.userMenu.ariaLabel}>
          <MenuRow
            icon={<Settings20Regular />}
            label={t.settings.userMenu.settings}
            href="/settings"
            onNavigate={close}
          />
          <MenuRow
            icon={<WeatherSunny20Regular />}
            label={t.settings.userMenu.appearance}
            onClick={close}
          />
          <MenuRow
            icon={<Database20Regular />}
            label={t.settings.userMenu.dataManagement}
            onClick={close}
          />
          <MenuRow
            icon={<Headphones20Regular />}
            label={t.settings.userMenu.support}
            href="/settings/support"
            onNavigate={close}
          />
          <MenuRow
            icon={<SignOut20Regular />}
            label={t.settings.userMenu.logout}
            destructive
            onClick={() => {
              close();
              signOut();
              router.push("/auth/login");
            }}
          />
        </nav>
      </PopoverSurface>
    </Popover>
  );
}
