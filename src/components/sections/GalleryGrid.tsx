"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { useTranslations } from "next-intl";
import { Lightbox } from "@/components/ui/Lightbox";
import { RevealItem, RevealList } from "@/components/ui/Reveal";

export type GalleryPhoto = { id: string; src: StaticImageData; alt: string; title: string; category: string };

// Tile sizes by position, so the grid reads as one composition on every width:
// phones and tablets use 2 columns, desktops 4.
const TILE_CLASSES: Record<number, string> = {
  0: "col-span-2 row-span-2",
  5: "col-span-2",
};

/** Photo mosaic; each tile opens the full-screen lightbox on that photo. */
export function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
  const t = useTranslations("lightbox");
  const [viewing, setViewing] = useState<number | null>(null);

  return (
    <>
      <RevealList className="grid auto-rows-[9rem] grid-cols-2 gap-2 sm:auto-rows-[12rem] sm:gap-3 lg:auto-rows-[13rem] lg:grid-cols-4">
        {photos.map((item, i) => (
          <RevealItem key={item.id} className={TILE_CLASSES[i] ?? ""}>
            <button
              type="button"
              onClick={() => setViewing(i)}
              aria-label={t("open", { title: item.title })}
              aria-haspopup="dialog"
              className="group relative block size-full cursor-zoom-in overflow-hidden rounded-plank"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                placeholder="blur"
                sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-graphite/90 via-graphite/40 to-transparent px-3 pt-10 pb-3 text-left sm:px-4">
                <span className="block text-xs text-oak">{item.category}</span>
                <span className="block text-sm font-medium text-paper">{item.title}</span>
              </span>
            </button>
          </RevealItem>
        ))}
      </RevealList>

      <Lightbox
        slides={photos.map(({ src, alt, title, category }) => ({ src, alt, title, meta: category }))}
        index={viewing}
        onIndexChange={setViewing}
        onClose={() => setViewing(null)}
      />
    </>
  );
}
