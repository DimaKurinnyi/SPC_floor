"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image, { type StaticImageData } from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type LightboxSlide = {
  src: StaticImageData;
  alt: string;
  title: string;
  /** Small oak label before the title, e.g. the photo's category. */
  meta?: string;
};

type LightboxProps = {
  slides: LightboxSlide[];
  /** The slide on screen, or null while the lightbox is closed. */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

// A swipe past either threshold moves to the neighbouring photo; a shorter one springs back.
const SWIPE_DISTANCE = 80;
const SWIPE_VELOCITY = 500;

const slideVariants = {
  enter: (direction: number) => ({ x: direction * 96, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction * -96, opacity: 0 }),
};

const controlClasses =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-plank text-ink transition-colors hover:text-oak";

/**
 * Full-screen photo viewer in a native <dialog>: swipe or drag, arrow keys, the side buttons
 * or the thumbnail strip move between photos. Escape, the close button or a click on the dark
 * area around the photo closes it.
 */
export function Lightbox({ slides, index, onIndexChange, onClose }: LightboxProps) {
  const t = useTranslations("lightbox");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef(false);
  const [direction, setDirection] = useState(1);

  // The native dialog is an external system: open and close it to match `index`.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
    if (index === null && dialog.open) dialog.close();
  }, [index]);

  // Centre the current thumbnail by scrolling the strip only; scrollIntoView would also move the page behind.
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = index === null ? null : strip?.children[index];
    if (!strip || !(thumb instanceof HTMLElement)) return;
    strip.scrollTo({ left: thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2, behavior: "smooth" });
  }, [index]);

  if (index === null) {
    return <dialog ref={dialogRef} aria-label={t("label")} onClose={onClose} />;
  }

  const slide = slides[index];
  const count = slides.length;
  const neighbours = count > 1 ? [(index + 1) % count, (index - 1 + count) % count] : [];

  const step = (delta: 1 | -1) => {
    setDirection(delta);
    onIndexChange((index + delta + count) % count);
  };
  const jump = (next: number) => {
    if (next === index) return;
    setDirection(next > index ? 1 : -1);
    onIndexChange(next);
  };

  const onDragEnd = (_: unknown, { offset, velocity }: PanInfo) => {
    if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) step(1);
    else if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) step(-1);
  };

  // The click that ends a drag lands wherever the pointer was released, so it must not close the viewer.
  const onStageClick = (event: MouseEvent) => {
    if (draggedRef.current) return;
    if (!(event.target as Element).closest("[data-lightbox-photo], button")) onClose();
  };

  const { width, height } = slide.src;

  return (
    <dialog
      ref={dialogRef}
      aria-label={t("label")}
      onClose={onClose}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") step(1);
        if (event.key === "ArrowLeft") step(-1);
      }}
      className="theme-dark m-0 size-full max-h-none max-w-none bg-surface/95 p-0 text-ink backdrop-blur-md backdrop:bg-transparent"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 py-2 pr-2 pl-4 sm:pr-4 sm:pl-6">
          <p className="min-w-0 truncate text-sm" aria-live="polite">
            {slide.meta ? (
              <>
                <span className="text-oak">{slide.meta}</span>
                <span className="mx-2 text-faint" aria-hidden>
                  /
                </span>
              </>
            ) : null}
            {slide.title}
            <span className="ml-3 text-muted">{t("counter", { current: index + 1, total: count })}</span>
          </p>
          <button type="button" onClick={onClose} aria-label={t("close")} className={controlClasses}>
            <X aria-hidden className="size-6" />
          </button>
        </div>

        <div
          className="relative min-h-0 flex-1"
          onPointerDown={() => {
            draggedRef.current = false;
          }}
          onClick={onStageClick}
        >
          <div className="absolute inset-0 px-2 sm:px-20">
            <div className="relative size-full">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={index}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex items-center justify-center [container-type:size]"
                >
                  {/* Sized like object-contain, but never above the file's own width, so small decor photos stay sharp. */}
                  <motion.div
                    data-lightbox-photo
                    drag={count > 1 ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.5}
                    onDragStart={() => {
                      draggedRef.current = true;
                    }}
                    onDragEnd={onDragEnd}
                    className="relative cursor-grab active:cursor-grabbing"
                    style={{
                      aspectRatio: `${width} / ${height}`,
                      width: `min(100cqw, 100cqh * ${width / height}, ${width}px)`,
                    }}
                  >
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      placeholder="blur"
                      sizes="100vw"
                      draggable={false}
                      className="object-contain select-none"
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {count > 1 ? (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={t("previous")}
                className={`${controlClasses} absolute top-1/2 left-2 -translate-y-1/2 bg-surface/70 sm:left-4`}
              >
                <ChevronLeft aria-hidden className="size-6" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={t("next")}
                className={`${controlClasses} absolute top-1/2 right-2 -translate-y-1/2 bg-surface/70 sm:right-4`}
              >
                <ChevronRight aria-hidden className="size-6" />
              </button>
            </>
          ) : null}
        </div>

        {count > 1 ? (
          <div
            ref={stripRef}
            role="group"
            aria-label={t("thumbnails")}
            className="relative flex justify-center-safe gap-2 overflow-x-auto px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6"
          >
            {slides.map((item, i) => (
              <button
                key={`${i}-${item.title}`}
                type="button"
                onClick={() => jump(i)}
                aria-label={item.title}
                aria-current={i === index ? "true" : undefined}
                className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-plank transition-opacity ${
                  i === index ? "ring-2 ring-oak" : "opacity-50 hover:opacity-100"
                }`}
              >
                {/* Wide decor strips are cropped hard by object-cover, so load more pixels than the 64px box. */}
                <Image src={item.src} alt="" fill sizes="160px" className="object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* Fetch both neighbours ahead, so a swipe never lands on a blank frame. */}
      <div hidden>
        {neighbours.map((i) => (
          <Image key={i} src={slides[i].src} alt="" sizes="100vw" loading="eager" />
        ))}
      </div>
    </dialog>
  );
}
