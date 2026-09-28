import { useTranslations } from "next-intl";
import { RevealItem, RevealList } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

const STEPS = ["inquiry", "offer", "presentation", "delivery"] as const;

export function Process() {
  const t = useTranslations("process");

  return (
    <Section id="process" title={t("title")} className="border-y border-hairline bg-graphite-raised/40">
      <RevealList ordered className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {STEPS.map((step, index) => (
          <RevealItem key={step} className="relative border-t border-hairline pt-8">
            <span aria-hidden className="absolute -top-[5px] left-0 size-2.5 rounded-full bg-oak" />
            <p aria-hidden className="font-display text-4xl font-semibold text-oak">
              {index + 1}
            </p>
            <h3 className="mt-4 font-display text-lg font-semibold">{t(`steps.${step}.title`)}</h3>
            <p className="mt-2 leading-relaxed text-muted">{t(`steps.${step}.text`)}</p>
          </RevealItem>
        ))}
      </RevealList>
    </Section>
  );
}
