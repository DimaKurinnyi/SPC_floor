"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const t = useTranslations("nav");
  const current = useLocale();
  const pathname = usePathname();

  return (
    <nav aria-label={t("language")} className={className}>
      <ul className="flex items-center gap-1 text-sm">
        {routing.locales.map((locale) => (
          <li key={locale}>
            <Link
              href={pathname}
              locale={locale}
              lang={locale}
              aria-current={locale === current ? "true" : undefined}
              className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-plank px-2 font-medium uppercase text-muted transition-colors hover:text-paper aria-[current=true]:text-oak"
            >
              {locale}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
