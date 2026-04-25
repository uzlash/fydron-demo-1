"use client";

import { Button, Field, Input } from "@fluentui/react-components";
import { Eye24Regular, EyeOff24Regular } from "@fluentui/react-icons";
import { useId, useState, type ReactNode } from "react";

type Props = {
  className?: string;
  label: ReactNode;
  value: string;
  onChange: (value: string) => void;
  validationState?: "none" | "error" | "warning" | "success";
  placeholder?: string;
  /** Renders on the same row as the label (e.g. “Forgot password?”) */
  labelEndSlot?: ReactNode;
};

export function PasswordInput({
  className,
  label,
  value,
  onChange,
  validationState = "none",
  placeholder,
  labelEndSlot,
}: Props) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  const labelRow =
    labelEndSlot != null ? (
      <div className="flex w-full min-w-0 max-w-full items-baseline justify-between gap-x-4">
        <span className="min-w-0 flex-1 text-inherit">{label}</span>
        <span className="shrink-0 text-right whitespace-nowrap">{labelEndSlot}</span>
      </div>
    ) : (
      label
    );

  const fieldClassName = [
    labelEndSlot != null &&
      [
        "[&]:w-full [&]:min-w-0",
        "[&>label]:!block [&>label]:!w-full [&>label]:!max-w-full [&>label]:!min-w-0",
      ].join(" "),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Field
      className={fieldClassName}
      // Composite label row (e.g. password + “Forgot password?”) is valid in the Field label slot at runtime
      label={labelRow as never}
      validationState={validationState}
      id={id}
    >
      <Input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(_, d) => onChange(d.value)}
        placeholder={placeholder}
        contentAfter={
          <Button
            appearance="transparent"
            size="small"
            className="min-h-6 min-w-6 shrink-0 text-secondary opacity-90 hover:opacity-70 hover:text-body"
            icon={
              visible ? (
                <EyeOff24Regular className="h-4 w-4" />
              ) : (
                <Eye24Regular className="h-4 w-4" />
              )
            }
            aria-label={visible ? "Hide password" : "Show password"}
            onClick={() => setVisible((v) => !v)}
          />
        }
      />
    </Field>
  );
}
