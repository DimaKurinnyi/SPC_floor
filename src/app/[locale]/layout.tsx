import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { company } from "@/content/company";
import { routing } from "@/i18n/routing";
import { absoluteUrl, localeAlternates, siteUrl } from "@/lib/site";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Providers } from "@/components/Providers";
import "../globals.css";

// latin-ext carries the Polish letters (ą, ę, ł, ń, ó, ś, ź, ż).
const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter", display: "swap" });
const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-montserrat",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(siteUrl),
    title: { default: `${t("title")} | ${company.brand}`, template: `%s | ${company.brand}` },
    description: t("description"),
    alternates: localeAlternates("/", locale),
    openGraph: {
      type: "website",
      siteName: company.brand,
      locale: locale === "pl" ? "pl_PL" : "en_GB",
      title: t("title"),
      description: t("description"),
      url: absoluteUrl("/", locale),
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    // data-scroll-behavior lets Next turn off the smooth scrolling from globals.css during route changes.
    <html lang={locale} data-scroll-behavior="smooth" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-dvh">
        <NextIntlClientProvider>
          <Providers>
            <Header />
            <main id="main" tabIndex={-1} className="focus:outline-none">
              {children}
            </main>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
