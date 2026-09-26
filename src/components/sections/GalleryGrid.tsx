"use client";

import { useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { RevealItem, RevealList } from "@/components/ui/Reveal";

export type GalleryPhoto = { id: string; src: StaticImageData; alt: string; title: string; category: string };

// Tile sizes by position, so the grid reads as one composition on every width:
// phones and tablets use 2 columns, desktops 4.
const TILE_CLASSES: Record<number, string> = {
  0: "col-span-2 row-span-2",
  5: "col-span-2",
};

/** Photo mosaic; each tile opens the photo full size in a <dialog> with previous/next navigation. */
export function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
  const t = useTranslations("gallery");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const photo = photos[index];

  const open = (next: number) => {
    setIndex(next);
    dialogRef.current?.showModal();
  };
  const step = (delta: number) => setIndex((current) => (current + delta + photos.length) % photos.length);
  const close = () => dialogRef.current?.close();

  return (
    <>
      <RevealList className="grid auto-rows-[9rem] grid-cols-2 gap-2 sm:auto-rows-[12rem] sm:gap-3 lg:auto-rows-[13rem] lg:grid-cols-4">
        {photos.map((item, i) => (
          <RevealItem key={item.id} className={TILE_CLASSES[i] ?? ""}>
            <button
              type="button"
              onClick={() => open(i)}
              aria-label={t("open", { title: item.title })}
              aria-haspopup="dialog"
              className="group relative block size-full overflow-hidden rounded-plank"
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

      <dialog
        ref={dialogRef}
        aria-label={photo.title}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          if (event.key === "ArrowLeft") step(-1);
        }}
        // A click on the dialog element itself (not its content) is a click on the backdrop.
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="m-auto max-h-none max-w-none bg-transparent p-0 text-paper backdrop:bg-graphite/95 backdrop:backdrop-blur-sm"
      >
        <div className="flex w-[min(92vw,72rem)] flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm">
              <span className="text-oak">{photo.category}</span>
              <span className="mx-2 text-faint" aria-hidden>
                /
              </span>
              {photo.title}
            </p>
            <button
              type="button"
              onClick={close}
              aria-label={t("close")}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-plank text-muted hover:bg-graphite-raised hover:text-paper"
            >
              <X aria-hidden className="size-6" />
            </button>
          </div>

          <div className="relative h-[min(72vh,48rem)] w-full">
            <Image key={photo.id} src={photo.src} alt={photo.alt} fill sizes="92vw" className="object-contain" />
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={t("previous")}
              className="inline-flex size-11 items-center justify-center rounded-plank border border-hairline text-paper hover:border-oak"
            >
              <ChevronLeft aria-hidden className="size-5" />
            </button>
            <p className="text-sm text-muted" aria-live="polite">
              {t("counter", { current: index + 1, total: photos.length })}
            </p>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={t("next")}
              className="inline-flex size-11 items-center justify-center rounded-plank border border-hairline text-paper hover:border-oak"
            >
              <ChevronRight aria-hidden className="size-5" />
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
