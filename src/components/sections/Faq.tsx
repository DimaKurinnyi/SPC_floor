import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

// Keys match `faq.items.*` in messages/*.json, in display order.
const ITEMS = ["moq", "delivery", "samples", "documents", "factoryBatch"] as const;

/**
 * Questions buyers ask before ordering, under the contact form. Native <details> elements, so the
 * answers open without JavaScript and stay in the HTML. FAQPage structured data lets search
 * engines show the questions in results.
 */
export function Faq() {
  const t = useTranslations("faq");
  const items = ITEMS.map((key) => ({ key, question: t(`items.${key}.question`), answer: t(`items.${key}.answer`) }));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <Section id="faq" title={t("title")} className="border-t border-hairline">
      <script
        type="application/ld+json"
        // Escape "<" so the copy can never close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <Reveal className="max-w-3xl divide-y divide-hairline border-y border-hairline">
        {items.map(({ key, question, answer }) => (
          <details key={key} className="group">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-base font-semibold transition-colors hover:text-oak sm:text-lg [&::-webkit-details-marker]:hidden">
              {question}
              <ChevronDown
                aria-hidden
                strokeWidth={1.75}
                className="size-5 shrink-0 text-oak transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none"
              />
            </summary>
            <p className="pb-6 leading-relaxed text-muted text-pretty">{answer}</p>
          </details>
        ))}
      </Reveal>
    </Section>
  );
}
