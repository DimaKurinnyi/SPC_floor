import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { company, companyAddress, companyPhoneHref } from "@/content/company";
import { Logo } from "./Logo";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 text-sm sm:px-6 md:grid-cols-3">
        <div>
          <Logo />
        </div>

        <div>
          <h2 className="font-display font-semibold">{t("contact")}</h2>
          <ul className="mt-4 grid gap-2 text-muted">
            <li>
              <a href={companyPhoneHref} className="hover:text-paper">
                {company.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${company.email}`} className="hover:text-paper">
                {company.email}
              </a>
            </li>
            <li>{companyAddress}</li>
          </ul>
        </div>

        <div>
          <h2 className="font-display font-semibold">{t("company")}</h2>
          <p className="mt-4 text-muted">{company.legalName}</p>
          <dl className="mt-2 grid gap-2 text-muted">
            <div className="flex gap-2">
              <dt>KRS</dt>
              <dd>{company.krs}</dd>
            </div>
            <div className="flex gap-2">
              <dt>NIP</dt>
              <dd>{company.nip}</dd>
            </div>
            <div className="flex gap-2">
              <dt>REGON</dt>
              <dd>{company.regon}</dd>
            </div>
            <div>
              <dt>{t("court")}</dt>
              <dd>{company.court}</dd>
            </div>
            <div className="flex gap-2">
              <dt>{t("shareCapital")}</dt>
              <dd>{company.shareCapital}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="border-t border-hairline">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-faint sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>{t("rights", { year, name: company.legalName })}</p>
          <Link href="/privacy" className="hover:text-paper">
            {t("privacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
