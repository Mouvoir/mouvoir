"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

// Label is always in the target language so a reader who only speaks
// that language can still recognize the link.
const LABELS: Record<Locale, string> = {
  fr: "Version française",
  en: "English version",
};

export function LocaleFooter() {
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const otherLocale =
    (routing.locales.find((l) => l !== locale) as Locale | undefined) ?? locale;

  return (
    <footer className="flex justify-center py-6 text-[13px]">
      <Link
        href={pathname}
        locale={otherLocale}
        className="text-[color:var(--muted)] hover:text-[color:var(--ink)] underline underline-offset-4 decoration-[color:var(--muted)]/40 hover:decoration-current transition-colors"
      >
        {LABELS[otherLocale]}
      </Link>
    </footer>
  );
}
