"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { AnimatePresence, motion } from "motion/react";
import type { Swatch } from "@/content/images";

type ProductGalleryProps = {
  /** Accessible name of the thumbnail group. */
  label: string;
  scene: { src: StaticImageData; alt: string; caption: string };
  swatches: Swatch[];
  /** Shown before a swatch name, e.g. "Kolekcja" → "Kolekcja Muskoka". */
  swatchPrefix: string;
  note: string;
};

/** Interior photo plus decor thumbnails; picking a thumbnail shows that decor in the main frame. */
export function ProductGallery({ label, scene, swatches, swatchPrefix, note }: ProductGalleryProps) {
  // -1 is the interior photo; 0..n are the swatches.
  const [selected, setSelected] = useState(-1);
  const items = [
    { src: scene.src, alt: scene.alt, caption: scene.caption },
    ...swatches.map((swatch) => {
      const title = `${swatchPrefix} ${swatch.name}`;
      return { src: swatch.src, alt: title, caption: title };
    }),
  ];
  const current = items[selected + 1];

  return (
    <div>
      <figure>
        <div className="relative aspect-4/3 overflow-hidden rounded-plank bg-graphite">
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
        </div>
        <figcaption className="mt-3 text-sm font-medium" aria-live="polite">
          {current.caption}
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
              key={item.caption}
              type="button"
              aria-label={item.caption}
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
    </div>
  );
}
