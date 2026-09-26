import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

type Href = Parameters<typeof getPathname>[0]["href"];

/** Absolute URL of `href` in `locale`, e.g. https://example.pl/en/privacy-policy. */
export function absoluteUrl(href: Href, locale: Locale) {
  return `${siteUrl}${getPathname({ href, locale })}`;
}

/** Canonical and hreflang alternates for a page, for use in generateMetadata. */
export function localeAlternates(href: Href, locale: Locale) {
  const languages = Object.fromEntries(routing.locales.map((l) => [l, absoluteUrl(href, l)]));
  return {
    canonical: absoluteUrl(href, locale),
    languages: { ...languages, "x-default": absoluteUrl(href, routing.defaultLocale) },
  };
}
