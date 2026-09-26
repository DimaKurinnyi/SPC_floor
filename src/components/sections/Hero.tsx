import Image from "next/image";
import { useTranslations } from "next-intl";
import { FileCheck, Package, Truck } from "lucide-react";
import { images } from "@/content/images";
import { LeadCta } from "@/components/lead-form/LeadCta";
import { PresentationCta } from "@/components/presentation/PresentationCta";
import { Reveal, RevealItem, RevealList } from "@/components/ui/Reveal";

const FACTS = [
  { key: "batch", icon: Package },
  { key: "docs", icon: FileCheck },
  { key: "delivery", icon: Truck },
] as const;

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-20 sm:px-6 sm:pt-16 lg:pt-24 lg:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <h1
              id="hero-title"
              className="font-display text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.5rem]"
            >
              {t("title")}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty">{t("lead")}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <LeadCta interest="wholesaleQuote">{t("ctaQuote")}</LeadCta>
              <PresentationCta variant="secondary">{t("ctaMeeting")}</PresentationCta>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-5">
            <div className="relative aspect-4/3 overflow-hidden rounded-plank sm:aspect-16/10 lg:aspect-4/5">
              <Image
                src={images.hero}
                alt={t("imageAlt")}
                fill
                preload
                placeholder="blur"
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>

        <RevealList className="mt-16 grid gap-8 border-t border-hairline pt-10 md:grid-cols-3 md:gap-10 lg:mt-20">
          {FACTS.map(({ key, icon: Icon }) => (
            <RevealItem key={key} className="flex gap-4">
              <Icon aria-hidden className="mt-0.5 size-6 shrink-0 text-oak" strokeWidth={1.5} />
              <div>
                <p className="font-display font-semibold">{t(`facts.${key}.title`)}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{t(`facts.${key}.text`)}</p>
              </div>
            </RevealItem>
          ))}
        </RevealList>
      </div>
    </section>
  );
}
