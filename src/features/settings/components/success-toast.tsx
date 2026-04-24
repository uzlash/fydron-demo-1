"use client";

import { Button, Text } from "@fluentui/react-components";
import { CheckmarkCircle24Filled, Dismiss24Regular } from "@fluentui/react-icons";

type Props = {
  title: string;
  body: string;
  onDismiss: () => void;
};

export function SuccessToast({ title, body, onDismiss }: Props) {
  return (
    <div
      className="fixed right-6 top-6 z-[100] flex w-[min(380px,calc(100vw-3rem))] gap-3 rounded-[8px] border border-border bg-surface p-4 shadow-[0_4px_24px_rgb(0,0,0,0.08)]"
      role="status"
    >
      <CheckmarkCircle24Filled className="mt-0.5 shrink-0 text-success" />
      <div className="min-w-0 flex-1">
        <Text weight="semibold" className="text-[14px] text-foreground" block>
          {title}
        </Text>
        <Text size={200} className="mt-0.5 block text-[13px] text-secondary">
          {body}
        </Text>
      </div>
      <Button
        appearance="transparent"
        size="small"
        icon={<Dismiss24Regular className="text-secondary" />}
        aria-label="Dismiss"
        onClick={onDismiss}
        className="shrink-0 -mr-1 -mt-1"
      />
    </div>
  );
}
