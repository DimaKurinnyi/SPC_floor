import { useTranslations } from "next-intl";
import { images } from "@/content/images";
import { Section } from "@/components/ui/Section";
import { GalleryGrid } from "./GalleryGrid";

export function Gallery() {
  const t = useTranslations("gallery");

  return (
    <Section id="gallery" title={t("title")} lead={t("lead")} className="pt-8 pb-8 sm:pt-10 sm:pb-10">
      <GalleryGrid
        photos={images.gallery.map(({ id, src, category }) => ({
          id,
          src,
          alt: t(`items.${id}.alt`),
          title: t(`items.${id}.title`),
          category: t(`categories.${category}`),
        }))}
      />
    </Section>
  );
}
