"use client";

import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";

/**
 * The id of the section crossing a thin band 40% down the viewport, or null when the band is
 * over a section that is not in `ids` (hero, form) or the page has none of them (privacy policy).
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);
  // The header outlives page changes, so observe again once another page's sections mount.
  const pathname = usePathname();

  useEffect(() => {
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        setActive(ids.find((id) => visible.has(id)) ?? null);
      },
      { rootMargin: "-40% 0px -59% 0px" },
    );
    for (const id of ids) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => {
      observer.disconnect();
      setActive(null);
    };
  }, [ids, pathname]);

  return active;
}
