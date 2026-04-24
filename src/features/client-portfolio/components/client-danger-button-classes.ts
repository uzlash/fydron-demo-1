/**
 * Shared styles for primary destructive (red) actions. Fluent `Button` primary blue
 * can win over `bg-danger` without `!`; these tokens keep both CTAs the same red.
 */
const DANGER_CORE =
  "!min-w-0 !rounded-[4px] !border-0 !bg-[var(--color-danger)] !px-4 !text-[13px] !text-white !font-medium hover:!opacity-90 focus-visible:!ring-2 focus-visible:!ring-[var(--color-danger)] focus-visible:!ring-offset-1";

export const CLIENT_DANGER_BUTTON_CLASS = `!h-9 !min-h-9 ${DANGER_CORE}`;

/** Modal footer destructive confirm (shorter control). */
export const CLIENT_DANGER_BUTTON_CLASS_COMPACT = `!h-8 !min-h-8 ${DANGER_CORE}`;
