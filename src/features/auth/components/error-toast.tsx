"use client";

import { Button, Text } from "@fluentui/react-components";
import { Dismiss12Regular, Dismiss16Regular } from "@fluentui/react-icons";

type Props = {
  title: string;
  body: string;
  onDismiss: () => void;
};

export function ErrorToast({ title, body, onDismiss }: Props) {
  return (
    <div
      className="fixed top-4 right-4 z-[100] flex w-[min(360px,calc(100vw-2rem))] gap-3 bg-white p-4 shadow-md"
      role="alert"
    >
      <div className="mt-1 shrink-0 h-4 w-4 bg-[#C2000C] flex items-center justify-center rotate-45 rounded-[3px]">
        <Dismiss12Regular className="text-white -rotate-45" />
      </div>
      <div className="min-w-0 flex-1">
        <Text  block className="text-[18px] leading-[24px] text-[#242424]">
          {title}
        </Text>
        <Text className="mt-1  pr-4 text-[15px] leading-[22px] text-[#242424]">
          {body}
        </Text>
      </div>
      <Button
        appearance="transparent"
        size="medium"
        icon={<Dismiss16Regular />}
        aria-label="Dismiss"
        onClick={onDismiss}
        className="shrink-0 self-start !min-w-0 !p-0 text-[#242424] opacity-90 hover:opacity-100"
      />
    </div>
  );
}
