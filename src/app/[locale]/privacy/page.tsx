import type { Metadata } from "next";
import { useFormatter, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { company, companyAddress } from "@/content/company";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { localeAlternates } from "@/lib/site";

// Placeholder policy structured along RODO art. 13. Have a lawyer review the final text before launch.
const UPDATED = new Date("2026-09-26");
const SECTIONS = ["controller", "purpose", "scope", "recipients", "retention", "rights", "cookies"] as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "privacy" });
  return { title: t("title"), alternates: localeAlternates("/privacy", locale) };
}

export default function PrivacyPage() {
  const t = useTranslations("privacy");
  const format = useFormatter();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-paper">
        <ArrowLeft aria-hidden className="size-4" />
        {t("back")}
      </Link>
      <h1 className="mt-8 font-display text-4xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-4 text-sm text-faint">
        {t("updated", { date: format.dateTime(UPDATED, { dateStyle: "long" }) })}
      </p>

      <div className="mt-12 grid gap-10">
        {SECTIONS.map((section) => (
          <section key={section}>
            <h2 className="font-display text-xl font-semibold">{t(`sections.${section}.title`)}</h2>
            <p className="mt-3 leading-relaxed text-muted">
              {section === "controller"
                ? t("sections.controller.text", {
                    legalName: company.legalName,
                    address: companyAddress,
                    krs: company.krs,
                    nip: company.nip,
                    email: company.email,
                  })
                : t(`sections.${section}.text`)}
            </p>
          </section>
        ))}
      </div>
    </article>
  );
}
