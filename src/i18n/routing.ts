import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pl", "en"],
  defaultLocale: "pl",
  // Polish lives at "/", English at "/en".
  localePrefix: "as-needed",
  // "/" always opens Polish: no redirect based on the browser language or a remembered choice.
  localeDetection: false,
  localeCookie: false,
  pathnames: {
    "/": "/",
    "/privacy": {
      pl: "/polityka-prywatnosci",
      en: "/privacy-policy",
    },
  },
});

export type Locale = (typeof routing.locales)[number];
