"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

type Tab = { id: string; label: string; content: ReactNode };

/** WAI-ARIA tabs, one per product. Panels are rendered on the server and passed in as content. */
export function ProductTabs({ label, tabs }: { label: string; tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0].id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const uid = useId();
  const tabId = (id: string) => `${uid}-tab-${id}`;
  const panelId = (id: string) => `${uid}-panel-${id}`;

  // Arrow keys move between tabs, as in the WAI-ARIA tabs pattern.
  const onTabKeyDown = (event: KeyboardEvent) => {
    const moves: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const index = tabs.findIndex((tab) => tab.id === active);
    const next = tabs[(index + moves[event.key] + tabs.length) % tabs.length].id;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onTabKeyDown}
        className="flex gap-6 border-b border-hairline sm:gap-10"
      >
        {tabs.map((tab) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[tab.id] = element;
              }}
              id={tabId(tab.id)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId(tab.id)}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.id)}
              className={`-mb-px border-b-2 pb-3 text-left font-display text-base font-semibold transition-colors sm:text-2xl ${
                selected ? "border-oak text-paper" : "border-transparent text-muted hover:text-paper"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={panelId(tab.id)}
          role="tabpanel"
          aria-labelledby={tabId(tab.id)}
          hidden={tab.id !== active}
          className="mt-10"
        >
          {tab.content}
        </div>
      ))}
    </>
  );
}
