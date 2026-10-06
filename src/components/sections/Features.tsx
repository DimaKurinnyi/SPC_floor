import { useTranslations } from "next-intl";
import {
  BadgeCheck,
  Droplets,
  Eraser,
  Fingerprint,
  Flame,
  Footprints,
  Gem,
  Grid3x3,
  Hammer,
  Heater,
  HeartPulse,
  Layers,
  Leaf,
  Puzzle,
  Shield,
  Thermometer,
} from "lucide-react";
import { RevealItem, RevealList } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

// Keys match `features.items.*` in messages/*.json.
const ITEMS = [
  { key: "click", icon: Puzzle },
  { key: "waterproof", icon: Droplets },
  { key: "underlay", icon: Layers },
  { key: "underfloorHeating", icon: Heater },
  { key: "indent", icon: Hammer },
  { key: "overExisting", icon: Grid3x3 },
  { key: "hdDesign", icon: Fingerprint },
  { key: "slipQuiet", icon: Footprints },
  { key: "eco", icon: Leaf },
  { key: "warm", icon: Thermometer },
  { key: "standards", icon: BadgeCheck },
  { key: "wear", icon: Gem },
  { key: "fire", icon: Flame },
  { key: "shield", icon: Shield },
  { key: "stain", icon: Eraser },
  { key: "healthy", icon: HeartPulse },
] as const;

/** Product properties as a grid of round oak line icons, right under the factory-direct cards. */
export function Features() {
  const t = useTranslations("features");

  return (
    <Section id="features" title={t("title")} className="pt-0 sm:pt-0">
      <RevealList className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4 sm:gap-x-8 sm:gap-y-12">
        {ITEMS.map(({ key, icon: Icon }) => (
          <RevealItem key={key} className="flex flex-col items-center text-center">
            <span className="flex size-16 items-center justify-center rounded-full border border-oak/40 bg-graphite-raised text-oak sm:size-20">
              <Icon aria-hidden className="size-7 sm:size-8" strokeWidth={1.25} />
            </span>
            <p className="mt-4 max-w-48 text-sm leading-snug font-medium text-balance sm:text-base">
              {t(`items.${key}`)}
            </p>
          </RevealItem>
        ))}
      </RevealList>
    </Section>
  );
}
