import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/site";

const PAGES = ["/", "/privacy"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap((href) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(href, locale),
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, absoluteUrl(href, l)])),
      },
    })),
  );
}
