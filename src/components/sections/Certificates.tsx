import Image from "next/image";
import { useTranslations } from "next-intl";
import { images } from "@/content/images";
import { Reveal, RevealItem, RevealList } from "@/components/ui/Reveal";

/**
 * Certificate and material-safety badges under the contact form, with no heading: the main
 * certificate centred on top, the other badges in a row below. They sit straight on the page
 * background, so their files have a transparent background (see images.ts).
 */
export function Certificates() {
  const t = useTranslations("certificates");
  const { main, row } = images.certificates;

  return (
    <section id="certificates" aria-label={t("title")} className="border-t border-hairline py-14 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal className="mx-auto w-full max-w-sm sm:max-w-md">
          <Image
            src={main.src}
            alt={t(`items.${main.id}`)}
            sizes="(min-width: 640px) 448px, 384px"
            className="h-auto w-full"
          />
        </Reveal>
        <RevealList className="mt-10 grid grid-cols-[1fr_2fr_1fr] items-center gap-4 sm:mt-14 sm:gap-10">
          {row.map(({ id, src }) => (
            <RevealItem key={id} className="flex justify-center">
              <Image
                src={src}
                alt={t(`items.${id}`)}
                sizes="(min-width: 640px) 400px, 50vw"
                className="h-auto max-h-16 w-auto max-w-full sm:max-h-28"
              />
            </RevealItem>
          ))}
        </RevealList>
      </div>
    </section>
  );
}
