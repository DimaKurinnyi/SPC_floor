import { useTranslations } from "next-intl";
import { Briefcase, ClipboardList, Handshake } from "lucide-react";
import { LeadCta } from "@/components/lead-form/LeadCta";
import { Reveal, RevealItem, RevealList } from "@/components/ui/Reveal";

const ITEMS = [
  { key: "commission", icon: Handshake },
  { key: "support", icon: ClipboardList },
  { key: "presentation", icon: Briefcase },
] as const;

/** Partner programme for architects, set apart from the page on a warm oak-tinted panel. */
export function ArchitectZone() {
  const t = useTranslations("architects");

  return (
    <section id="architects" aria-labelledby="architects-title" className="pb-10 sm:pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* A third narrower than the other sections (736px vs 1104px), so the panel reads as an aside. */}
        <div className="mx-auto max-w-184 rounded-plank border border-oak/30 bg-oak/8 p-6 sm:p-10 lg:p-12">
          <Reveal>
            <h2
              id="architects-title"
              className="font-display text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl"
            >
              {t("title")}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted text-pretty">{t("lead")}</p>
          </Reveal>

          <RevealList className="mt-10 grid gap-6 border-t border-oak/20 pt-10">
            {ITEMS.map(({ key, icon: Icon }) => (
              <RevealItem key={key} className="flex gap-5">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-plank border border-oak/40 text-oak">
                  <Icon aria-hidden className="size-6" strokeWidth={1.5} />
                </span>
                <p className="pt-2.5 leading-relaxed text-muted">
                  {t.rich(`items.${key}`, {
                    b: (chunks) => <strong className="font-semibold text-paper">{chunks}</strong>,
                  })}
                </p>
              </RevealItem>
            ))}
          </RevealList>

          <Reveal>
            {/* Opens the form with "Biuro Projektowe" already chosen as the investment type. */}
            <LeadCta investmentType="designOffice" className="mt-10">
              {t("cta")}
            </LeadCta>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
