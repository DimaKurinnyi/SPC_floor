import Image from "next/image";
import { useTranslations } from "next-intl";
import { images } from "@/content/images";
import { RevealItem, RevealList } from "@/components/ui/Reveal";

/** A plain row of certificate and material-safety badges under the contact form, with no heading. */
export function Certificates() {
  const t = useTranslations("certificates");

  return (
    <section id="certificates" aria-label={t("title")} className="border-t border-hairline py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <RevealList className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {images.certificates.map(({ id, src }) => (
            <RevealItem key={id}>
              {/* The badges come on white, so they sit on white tiles of one size. */}
              <div className="relative aspect-4/3 overflow-hidden rounded-plank bg-white">
                <Image
                  src={src}
                  alt={t(`items.${id}`)}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 270px, 50vw"
                  className="object-contain p-4 sm:p-6"
                />
              </div>
            </RevealItem>
          ))}
        </RevealList>
      </div>
    </section>
  );
}
