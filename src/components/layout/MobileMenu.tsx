"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LEAD_FORM_ID } from "@/components/lead-form/LeadFormContext";
import { buttonClasses } from "@/components/ui/button-styles";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { NAV_HASHES, NAV_ITEMS } from "./nav-items";
import { useActiveSection } from "./useActiveSection";

export function MobileMenu() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const active = useActiveSection(NAV_HASHES);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? t("closeMenu") : t("openMenu")}
        className="inline-flex size-11 items-center justify-center rounded-plank text-paper hover:bg-graphite-raised"
      >
        {open ? <X aria-hidden className="size-6" /> : <Menu aria-hidden className="size-6" />}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-full border-b border-hairline bg-graphite px-4 pt-2 pb-6 sm:px-6"
          >
            <ul className="divide-y divide-hairline">
              {NAV_ITEMS.map((item) => {
                const current = item.hash === active;
                return (
                  <li key={item.key}>
                    <Link
                      href={{ pathname: "/", hash: item.hash }}
                      onClick={close}
                      aria-current={current ? "location" : undefined}
                      className="group flex min-h-12 items-center font-display text-lg text-paper"
                    >
                      {/* Same underline as the desktop nav, sized to the text rather than the whole row. */}
                      <span
                        className={`relative py-1 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-center after:bg-oak after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100 motion-reduce:after:transition-none ${
                          current ? "after:scale-x-100" : "after:scale-x-0"
                        }`}
                      >
                        {t(item.key)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 flex items-center justify-between gap-4">
              <LocaleSwitcher />
              <Link
                href={{ pathname: "/", hash: LEAD_FORM_ID }}
                onClick={close}
                className={buttonClasses("primary")}
              >
                {t("cta")}
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
