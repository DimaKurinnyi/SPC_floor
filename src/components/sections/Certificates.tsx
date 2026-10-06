import Image from "next/image";
import { useTranslations } from "next-intl";
import { images } from "@/content/images";
import { RevealItem, RevealList } from "@/components/ui/Reveal";

/**
 * Certificate and material-safety badges under the contact form, with no heading: one row of
 * same-size boxes (two by two on phones), each badge scaled to fit its box. They sit straight on
 * the page background, so their files have a transparent background (see images.ts).
 */
export function Certificates() {
  const t = useTranslations("certificates");

  return (
    <section id="certificates" aria-label={t("title")} className="border-t border-hairline py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <RevealList className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-10">
          {images.certificates.map(({ id, src }) => (
            <RevealItem key={id} className="relative aspect-3/2">
              <Image
                src={src}
                alt={t(`items.${id}`)}
                fill
                sizes="(min-width: 640px) 25vw, 50vw"
                className="object-contain"
              />
            </RevealItem>
          ))}
        </RevealList>
      </div>
    </section>
  );
}
