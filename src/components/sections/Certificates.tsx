import Image from "next/image";
import { useTranslations } from "next-intl";
import { images } from "@/content/images";
import { RevealItem, RevealList } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

/** Certificate and material-safety badges, under the contact form. */
export function Certificates() {
  const t = useTranslations("certificates");

  return (
    <Section
      id="certificates"
      title={t("title")}
      lead={t("lead")}
      className="border-t border-hairline bg-graphite-raised/40"
    >
      <RevealList className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {images.certificates.map(({ id, src }) => (
          <RevealItem key={id}>
            <figure>
              {/* The badges come on white, so they sit on white tiles of one size. The caption names
                  the badge, so the image itself gets an empty alt and is not read out twice. */}
              <div className="relative aspect-4/3 overflow-hidden rounded-plank bg-white">
                <Image
                  src={src}
                  alt=""
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 270px, 50vw"
                  className="object-contain p-4 sm:p-6"
                />
              </div>
              <figcaption className="mt-3 text-sm font-medium">{t(`items.${id}`)}</figcaption>
            </figure>
          </RevealItem>
        ))}
      </RevealList>
    </Section>
  );
}
