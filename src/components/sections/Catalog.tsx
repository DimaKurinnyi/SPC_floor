import { useMessages, useTranslations } from "next-intl";
import { LeadCta } from "@/components/lead-form/LeadCta";
import { images } from "@/content/images";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { PanelLayers, type PanelDecor, type PanelFormat } from "./PanelLayers";
import { ProductGallery } from "./ProductGallery";

// Top to bottom, the order PanelLayers draws them in.
const LAYERS = ["uv", "wear", "decor", "core", "underlay"] as const;

type ProductKey = "floors" | "panels";

const PRODUCTS: { id: ProductKey; decor: PanelDecor; format: PanelFormat }[] = [
  { id: "floors", decor: "wood", format: "plank" },
  { id: "panels", decor: "stone", format: "tile" },
];

export function Catalog() {
  const t = useTranslations("catalog");

  return (
    <Section id="products" title={t("title")} lead={t("lead")} className="border-y border-hairline bg-graphite-raised/40">
      <div className="grid gap-16 sm:gap-20">
        {PRODUCTS.map((product, index) => (
          <Product key={product.id} {...product} mirrored={index % 2 === 1} />
        ))}
      </div>
    </Section>
  );
}

type ProductProps = { mirrored: boolean } & (typeof PRODUCTS)[number];

function Product({ id, decor, format, mirrored }: ProductProps) {
  const t = useTranslations("catalog");
  const messages = useMessages();
  const p = `products.${id}` as const;
  const headingId = `product-${id}`;
  // Rows come straight from messages/*.json, so specs can be added or removed without touching code.
  const specs = Object.entries(messages.catalog.products[id].specs);

  return (
    <article aria-labelledby={headingId} className={mirrored ? "border-t border-hairline pt-16 sm:pt-20" : undefined}>
      <Reveal className="max-w-2xl">
        <h3 id={headingId} className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {t(`${p}.name`)}
        </h3>
        <p className="mt-2 font-medium text-oak">{t(`${p}.variant`)}</p>
        <p className="mt-4 text-lg leading-relaxed text-muted text-pretty">{t(`${p}.description`)}</p>
      </Reveal>

      <div className="mt-12 grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
        <PanelLayers
          decor={decor}
          format={format}
          labelsTitle={t("layersTitle")}
          labels={LAYERS.map((layer) => ({
            name: t(`${p}.layers.${layer}.name`),
            text: t(`${p}.layers.${layer}.text`),
          }))}
          className={`lg:col-span-7 ${mirrored ? "lg:order-2" : ""}`}
        />
        <Reveal className="lg:col-span-5">
          <ProductGallery
            label={t("gallery")}
            scene={{ src: images.products[id].scene, alt: t(`${p}.sceneAlt`), caption: t("sceneLabel") }}
            swatches={images.products[id].swatches}
            swatchPrefix={t(`${p}.swatchPrefix`)}
            note={t(`${p}.collections`)}
          />
        </Reveal>
      </div>

      <Reveal className="mt-16">
        <h4 className="font-display text-lg font-semibold">{t("specsTitle")}</h4>
        <dl className="mt-6 grid gap-x-12 md:grid-cols-2">
          {specs.map(([row, { label, value }]) => (
            <div key={row} className="flex items-baseline justify-between gap-6 border-b border-hairline py-4">
              <dt className="text-muted">{label}</dt>
              <dd className="text-right font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        <LeadCta interest="wholesaleQuote" className="mt-10">
          {t("cta")}
        </LeadCta>
      </Reveal>
    </article>
  );
}
