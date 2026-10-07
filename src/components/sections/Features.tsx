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

/**
 * Product properties as a compact spec-sheet grid right under the factory-direct cards: a small
 * oak line icon beside each caption, cells split by hairlines, four per row (two on phones).
 */
export function Features() {
  const t = useTranslations("features");

  return (
    <Section id="features" title={t("title")} className="pt-0 pb-14 sm:pt-0 sm:pb-20">
      {/* The 1px gap over a hairline background draws the lines between cells. */}
      <RevealList className="grid grid-cols-2 gap-px overflow-hidden rounded-plank border border-hairline bg-hairline lg:grid-cols-4">
        {ITEMS.map(({ key, icon: Icon }) => (
          <RevealItem key={key} className="flex items-center gap-3 bg-graphite px-3 py-3 sm:gap-4 sm:px-5 sm:py-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-oak/40 text-oak sm:size-10">
              <Icon aria-hidden className="size-4.5 sm:size-5" strokeWidth={1.5} />
            </span>
            <p className="text-xs leading-snug font-medium text-pretty sm:text-sm">{t(`items.${key}`)}</p>
          </RevealItem>
        ))}
      </RevealList>
    </Section>
  );
}
