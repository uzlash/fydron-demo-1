"use client";

import { Button, Text } from "@fluentui/react-components";
import { useLocale } from "@/i18n/locale-context";

export function EmptyDashboardState({ onAction }: { onAction?: () => void }) {
  const { t } = useLocale();

  return (
    <section className="flex min-h-0 flex-1 items-center justify-center border-t border-border-soft px-6 pb-20">
      <div className="flex max-w-[400px] flex-col items-center text-center">
        <Text size={500} weight="semibold" className="mb-3 text-[16px] text-foreground">
          {t.dashboard.empty.title}
        </Text>
        <Text size={200} className="mb-6 text-[13px] leading-[18px] text-secondary">
          {t.dashboard.empty.subtitle}
        </Text>
        <Button 
          appearance="primary" 
          className="h-8 rounded-[4px] bg-primary px-4 text-primary-foreground"
          icon={<span className="text-[16px] leading-none pb-[2px] font-light">+</span>}
          onClick={onAction}
        >
          {t.dashboard.empty.cta}
        </Button>
      </div>
    </section>
  );
}
