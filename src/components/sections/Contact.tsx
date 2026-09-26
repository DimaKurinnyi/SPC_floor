import { useTranslations } from "next-intl";
import { Mail, Phone } from "lucide-react";
import { company, companyPhoneHref } from "@/content/company";
import { LeadForm } from "@/components/lead-form/LeadForm";
import { LEAD_FORM_ID } from "@/components/lead-form/LeadFormContext";
import { Reveal } from "@/components/ui/Reveal";

export function Contact() {
  const t = useTranslations("form");

  return (
    <section id={LEAD_FORM_ID} aria-labelledby="contact-title" className="py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <h2
            id="contact-title"
            className="font-display text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted text-pretty">{t("lead")}</p>

          <div className="mt-10 border-t border-hairline pt-8">
            <p className="text-sm text-muted">{t("directContact")}</p>
            <ul className="mt-4 grid gap-3">
              <li>
                <a href={companyPhoneHref} className="inline-flex items-center gap-3 text-lg hover:text-oak">
                  <Phone aria-hidden className="size-5 text-oak" strokeWidth={1.5} />
                  {company.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${company.email}`} className="inline-flex items-center gap-3 text-lg hover:text-oak">
                  <Mail aria-hidden className="size-5 text-oak" strokeWidth={1.5} />
                  {company.email}
                </a>
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7">
          <LeadForm />
        </Reveal>
      </div>
    </section>
  );
}
