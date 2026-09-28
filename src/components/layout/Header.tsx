import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LEAD_FORM_ID } from "@/components/lead-form/LeadFormContext";
import { buttonClasses } from "@/components/ui/button-styles";
import { DesktopNav } from "./DesktopNav";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-graphite/90 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-50 focus:rounded-plank focus:bg-amber focus:px-4 focus:py-2 focus:text-graphite"
      >
        {t("skipToContent")}
      </a>
      <div className="relative mx-auto flex h-18 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link href="/" className="shrink-0 rounded-plank">
          <Logo />
        </Link>

        <DesktopNav />

        <div className="flex items-center gap-2 sm:gap-4">
          <LocaleSwitcher className="hidden lg:block" />
          {/* The wrapper hides the button on phones; `hidden` on the button itself loses to its inline-flex. */}
          <div className="hidden sm:block">
            <Link
              href={{ pathname: "/", hash: LEAD_FORM_ID }}
              className={buttonClasses("primary", "min-h-10 px-4 py-2")}
            >
              {t("cta")}
            </Link>
          </div>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
