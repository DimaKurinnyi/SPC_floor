"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Images } from "lucide-react";
import { images, type Swatch } from "@/content/images";
import { Lightbox, type LightboxSlide } from "@/components/ui/Lightbox";
import { PresentationCta } from "@/components/presentation/PresentationCta";
import { Section } from "@/components/ui/Section";

const PRODUCTS = ["floors", "panels"] as const;
type Product = (typeof PRODUCTS)[number];

// Strips are offset like a real floor, where joints never line up row to row.
const OFFSETS = ["md:ml-0", "md:ml-[14%]", "md:ml-[5%]", "md:ml-[19%]", "md:ml-[9%]", "md:ml-[2%]", "md:ml-[16%]"];

/** Large-format panels get taller strips than planks. */
const STRIP_HEIGHT: Record<Product, string> = {
  floors: "h-24 sm:h-28",
  panels: "h-36 sm:h-44",
};

/**
 * Real decors of both products as offset strips, one tab per product. A strip whose swatch has
 * collection photos is a button that opens them all in the lightbox.
 */
export function Decors() {
  const t = useTranslations("decors");
  const tc = useTranslations("catalog");
  const [active, setActive] = useState<Product>("floors");
  const [slides, setSlides] = useState<LightboxSlide[]>([]);
  const [viewing, setViewing] = useState<number | null>(null);
  const tabRefs = useRef<Record<Product, HTMLButtonElement | null>>({ floors: null, panels: null });
  const uid = useId();
  const tabId = (product: Product) => `${uid}-tab-${product}`;
  const panelId = (product: Product) => `${uid}-panel-${product}`;

  // Arrow keys move between tabs, as in the WAI-ARIA tabs pattern.
  const onTabKeyDown = (event: KeyboardEvent) => {
    const moves: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const index = PRODUCTS.indexOf(active);
    const next = PRODUCTS[(index + moves[event.key] + PRODUCTS.length) % PRODUCTS.length];
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const openCollection = (label: string, photos: NonNullable<Swatch["photos"]>) => {
    setSlides(photos.map(({ code, src }) => ({ src, alt: `${label}, ${code}`, title: code, meta: label })));
    setViewing(0);
  };

  return (
    <Section id="decors" title={t("title")} lead={t("lead")} className="pb-10 sm:pb-12">
      <div
        role="tablist"
        aria-label={t("title")}
        onKeyDown={onTabKeyDown}
        className="flex gap-6 border-b border-hairline sm:gap-10"
      >
        {PRODUCTS.map((product) => {
          const selected = product === active;
          return (
            <button
              key={product}
              ref={(element) => {
                tabRefs.current[product] = element;
              }}
              id={tabId(product)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId(product)}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(product)}
              className={`-mb-px border-b-2 pb-3 text-left font-display text-sm font-semibold transition-colors sm:text-lg ${
                selected ? "border-oak text-paper" : "border-transparent text-muted hover:text-paper"
              }`}
            >
              {tc(`products.${product}.name`)}
            </button>
          );
        })}
      </div>

      {PRODUCTS.map((product) => (
        <div
          key={product}
          id={panelId(product)}
          role="tabpanel"
          aria-labelledby={tabId(product)}
          hidden={product !== active}
          className="mt-10"
        >
          {/* Clip the sideways slide-in so it never adds a horizontal scrollbar. */}
          <ul className="grid gap-2 overflow-x-clip">
            {images.products[product].swatches.map((swatch: Swatch, index) => {
              const label = `${tc(`products.${product}.swatchPrefix`)} ${swatch.name}`;
              const photos = swatch.photos;
              return (
                <motion.li
                  key={swatch.name}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -48 : 48 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
                  className={`group relative overflow-hidden rounded-plank md:w-[81%] ${STRIP_HEIGHT[product]} ${OFFSETS[index % OFFSETS.length]}`}
                >
                  <Image
                    src={swatch.src}
                    alt=""
                    fill
                    placeholder="blur"
                    sizes="(min-width: 768px) 70vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-has-[button:hover]:scale-[1.03] motion-reduce:transition-none"
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-graphite/85 via-graphite/30 to-transparent" />
                  {photos ? (
                    <button
                      type="button"
                      onClick={() => openCollection(label, photos)}
                      className="absolute inset-0 flex items-center justify-between gap-4 px-6 text-left focus-visible:outline-offset-[-4px]"
                    >
                      <span className="font-display text-lg font-semibold">{label}</span>
                      <span className="inline-flex shrink-0 items-center gap-2 rounded-plank bg-graphite/70 px-3 py-1.5 text-sm text-paper backdrop-blur-sm transition-colors group-has-[button:hover]:text-oak">
                        <Images aria-hidden className="size-4" strokeWidth={1.75} />
                        {t("photoCount", { count: photos.length })}
                      </span>
                    </button>
                  ) : (
                    <p className="absolute inset-y-0 left-0 flex items-center px-6 font-display text-lg font-semibold">
                      {label}
                    </p>
                  )}
                </motion.li>
              );
            })}
          </ul>
          <p className="mt-6 text-sm text-muted">{tc(`products.${product}.collections`)}</p>
        </div>
      ))}

      <PresentationCta className="mt-12">{t("cta")}</PresentationCta>

      <Lightbox slides={slides} index={viewing} onIndexChange={setViewing} onClose={() => setViewing(null)} />
    </Section>
  );
}
