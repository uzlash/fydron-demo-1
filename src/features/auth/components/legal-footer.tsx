"use client";

import { Text } from "@fluentui/react-components";
import NextLink from "next/link";
import { useLocale } from "@/i18n/locale-context";

export function LegalFooter() {
  const { t } = useLocale();
  return (
    <div className="flex w-full justify-center">
      <Text
        as="p"
        size={200}
        className="m-0 w-[314px] !text-center font-['Segoe_UI'] !text-[14px] font-normal !leading-[22px] text-[#71717B]"
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
    </div>
  );
}
