"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NAV_HASHES, NAV_ITEMS } from "./nav-items";
import { useActiveSection } from "./useActiveSection";

/** Section links with an oak underline that grows from the centre on hover and stays on the current section. */
export function DesktopNav() {
  const t = useTranslations("nav");
  const active = useActiveSection(NAV_HASHES);

  return (
    <nav aria-label={t("main")} className="hidden lg:block">
      <ul className="flex items-center gap-8 text-sm">
        {NAV_ITEMS.map((item) => {
          const current = item.hash === active;
          return (
            <li key={item.key}>
              <Link
                href={{ pathname: "/", hash: item.hash }}
                aria-current={current ? "location" : undefined}
                className={`relative block py-2 transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-center after:bg-oak after:transition-transform after:duration-300 after:ease-out hover:text-paper hover:after:scale-x-100 motion-reduce:after:transition-none ${
                  current ? "text-paper after:scale-x-100" : "text-muted after:scale-x-0"
                }`}
              >
                {t(item.key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
