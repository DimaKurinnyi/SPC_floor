import { useTranslations } from "next-intl";
import { Coins, Construction, Truck } from "lucide-react";
import { RevealItem, RevealList } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

const ITEMS = [
  { key: "batch", icon: Construction },
  { key: "price", icon: Coins },
  { key: "delivery", icon: Truck },
] as const;

/** Why buy factory-direct: three cards right under the product catalog. */
export function FactoryDirect() {
  const t = useTranslations("factory");

  return (
    <Section id="factory" title={t("title")}>
      <RevealList className="grid gap-4 md:grid-cols-3 md:gap-6">
        {ITEMS.map(({ key, icon: Icon }) => (
          <RevealItem
            key={key}
            className="flex flex-col rounded-plank border border-hairline bg-surface-raised p-6 sm:p-8"
          >
            <span className="flex size-12 items-center justify-center rounded-plank border border-oak/40 text-oak">
              <Icon aria-hidden className="size-6" strokeWidth={1.5} />
            </span>
            <h3 className="mt-6 font-display text-lg leading-snug font-semibold text-balance">
              {t(`items.${key}.title`)}
            </h3>
            <p className="mt-3 leading-relaxed text-muted">{t(`items.${key}.text`)}</p>
          </RevealItem>
        ))}
      </RevealList>
    </Section>
  );
}
