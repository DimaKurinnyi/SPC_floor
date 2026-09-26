import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/button-styles";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="mx-auto max-w-2xl px-4 py-32 text-center sm:px-6">
      <h1 className="font-display text-4xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-4 text-lg text-muted">{t("text")}</p>
      <Link href="/" className={buttonClasses("primary", "mt-10")}>
        {t("back")}
      </Link>
    </div>
  );
}
