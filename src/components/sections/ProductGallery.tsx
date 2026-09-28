"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { Maximize2 } from "lucide-react";
import type { Swatch } from "@/content/images";
import { Lightbox, type LightboxSlide } from "@/components/ui/Lightbox";

type ProductGalleryProps = {
  /** Accessible name of the thumbnail group. */
  label: string;
  scene: { src: StaticImageData; alt: string; caption: string };
  swatches: Swatch[];
  /** Shown before a swatch name, e.g. "Kolekcja" → "Kolekcja Muskoka". */
  swatchPrefix: string;
  note: string;
};

/**
 * Interior photo plus decor thumbnails; picking a thumbnail shows that decor in the main frame,
 * and clicking the main frame opens every photo in the full-screen lightbox.
 */
export function ProductGallery({ label, scene, swatches, swatchPrefix, note }: ProductGalleryProps) {
  const t = useTranslations("lightbox");
  // -1 is the interior photo; 0..n are the swatches.
  const [selected, setSelected] = useState(-1);
  // Index into `items`, or null while the lightbox is closed.
  const [viewing, setViewing] = useState<number | null>(null);
  const items: LightboxSlide[] = [
    { src: scene.src, alt: scene.alt, title: scene.caption },
    ...swatches.map((swatch) => {
      const title = `${swatchPrefix} ${swatch.name}`;
      return { src: swatch.src, alt: title, title };
    }),
  ];
  const current = items[selected + 1];

  return (
    <div>
      <figure>
        <button
          type="button"
          onClick={() => setViewing(selected + 1)}
          aria-label={t("open", { title: current.title })}
          aria-haspopup="dialog"
          className="group relative block aspect-4/3 w-full cursor-zoom-in overflow-hidden rounded-plank bg-graphite"
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={selected}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0"
            >
              <Image
                src={current.src}
                alt={current.alt}
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <span className="absolute top-3 right-3 flex size-10 items-center justify-center rounded-plank bg-graphite/70 text-paper backdrop-blur-sm transition-colors group-hover:text-oak">
            <Maximize2 aria-hidden className="size-5" />
          </span>
        </button>
        <figcaption className="mt-3 text-sm font-medium" aria-live="polite">
          {current.title}
        </figcaption>
      </figure>

      {/* One row with every thumbnail, however many decors a product has. */}
      <div
        role="group"
        aria-label={label}
        className="mt-4 grid gap-2"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => {
          const pressed = selected === index - 1;
          return (
            <button
              key={item.title}
              type="button"
              aria-label={item.title}
              aria-pressed={pressed}
              onClick={() => setSelected(index - 1)}
              className={`relative aspect-square overflow-hidden rounded-plank ring-offset-2 ring-offset-graphite transition-opacity ${
                pressed ? "ring-2 ring-oak" : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={item.src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-muted">{note}</p>

      {/* Leafing through the lightbox moves the main frame along, so closing it leaves the last photo shown. */}
      <Lightbox
        slides={items}
        index={viewing}
        onIndexChange={(index) => {
          setViewing(index);
          setSelected(index - 1);
        }}
        onClose={() => setViewing(null)}
      />
    </div>
  );
}
