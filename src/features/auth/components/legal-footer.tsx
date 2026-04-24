"use client";

import { Text } from "@fluentui/react-components";
import NextLink from "next/link";
import { useLocale } from "@/i18n/locale-context";

export function LegalFooter() {
  const { t } = useLocale();
  return (
    <Text
      as="p"
      size={200}
      className="m-0 max-w-md text-center text-sm leading-snug text-secondary"
    >
      {t.common.termsLead}
      <br />
      <NextLink href="#" className="text-primary underline">
        {t.common.terms}
      </NextLink>{" "}
      {t.common.and}{" "}
      <NextLink href="#" className="text-primary underline">
        {t.common.privacy}
      </NextLink>
      .
    </Text>
  );
}
