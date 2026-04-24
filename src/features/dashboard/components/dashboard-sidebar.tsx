"use client";


import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Text } from "@fluentui/react-components";

import {
  DataBarHorizontal20Filled,
  GridDots20Regular,
  Chat20Regular,
  Folder20Regular,
  Money20Regular,
  Share20Regular,
  Payment20Regular,
  Cloud20Regular,
  Sparkle20Regular,
} from "@fluentui/react-icons";
import { FydronLogo } from "@/features/auth/components/fydron-logo";
import { SidebarProfileMenu } from "@/features/dashboard/components/sidebar-profile-menu";
import { demoDisplayName } from "@/features/auth/demo-accounts";
import { useDemoSession } from "@/features/auth/demo-session-context";
import { useLocale } from "@/i18n/locale-context";

type NavItem = {
  key: string;
  label: string;
  icon: ReactNode;
  href?: string;
  disabled?: boolean;
  alertCount?: number;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

function NavRow({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = item.href
    ? item.href === "/dashboard"
      ? pathname === item.href
      : pathname.startsWith(item.href)
    : false;

  const rowClassName = `group relative flex h-9 items-center justify-between pl-[24px] pr-[16px] ${
    isActive
      ? "bg-surface text-foreground font-semibold"
      : item.disabled
        ? "text-muted"
        : "text-body hover:bg-border-soft"
  }`;

  const content = (
    <>
      {isActive && (
        <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 bg-primary" />
      )}

      <div className="flex min-w-0 items-center gap-[12px]">
        <span className={`w-4 text-center font-mono text-[16px] leading-none ${isActive ? "text-primary" : "text-secondary"}`}>
          {item.icon}
        </span>
        <span className="truncate text-[13px] pb-[1px]">{item.label}</span>
      </div>

      {item.alertCount ? (
        <span className="inline-flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-primary-foreground">
          {item.alertCount}
        </span>
      ) : null}
    </>
  );

  if (item.href && !item.disabled) {
    return (
      <Link href={item.href} className={`${rowClassName} cursor-pointer`}>
        {content}
      </Link>
    );
  }

  return (
    <div className={`${rowClassName} cursor-default`}>
      {content}
    </div>
  );
}

export function DashboardSidebar() {
  const { user } = useDemoSession();
  const { t } = useLocale();

  const groups: NavGroup[] = [
    {
      title: t.dashboard.sections.platform,
      items: [
        { key: "dashboard", label: t.dashboard.nav.dashboard, icon: <DataBarHorizontal20Filled />, href: "/dashboard" },
        { key: "matrix", label: t.dashboard.nav.matrix, icon: <GridDots20Regular />, href: "/matrix" },
        { key: "globalMessages", label: t.dashboard.nav.globalMessages, icon: <Chat20Regular />, alertCount: 1 },
        { key: "clientPortfolio", label: t.dashboard.nav.clientPortfolio, icon: <Folder20Regular />, href: "/client-portfolio" },
        { key: "partnerAssets", label: t.dashboard.nav.partnerAssets, icon: <Money20Regular />, href: "/partner-assets" },
        {
          key: "exportCenter",
          label: t.dashboard.nav.exportCenter,
          icon: <Share20Regular />,
          href: "/export-center",
        },
      ],
    },
    {
      title: t.dashboard.sections.payments,
      items: [{ key: "billingSubscription", label: t.dashboard.nav.billingSubscription, icon: <Payment20Regular />, href: "/billing-subscriptions" }],
    },
    {
      title: t.dashboard.sections.other,
      items: [
        { key: "hrVault", label: t.dashboard.nav.hrVault, icon: <Cloud20Regular />, disabled: true },
        { key: "insights", label: t.dashboard.nav.insights, icon: <Sparkle20Regular />, disabled: true },
      ],
    },
  ];

  return (
    <aside className="flex h-full w-[240px] shrink-0 flex-col overflow-hidden border-none bg-background">
      <div className="px-6 py-[22px]">
        <FydronLogo className="text-[30px]" />
      </div>

      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto mt-2">
        {groups.map((group) => (
          <div key={group.title} className="flex flex-col">
            <Text size={200} className="mb-[6px] px-6 text-[10px] text-muted uppercase tracking-wide">
              {group.title}
            </Text>
            <div className="flex flex-col gap-[2px]">
              {group.items.map((item) => (
                <NavRow key={item.key} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto px-[24px] py-[24px]">
        <SidebarProfileMenu
          name={user ? demoDisplayName(user) : t.dashboard.profile.name}
          email={user?.email ?? t.dashboard.profile.email}
        />
      </div>
    </aside>
  );
}
