"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/** A collapsed spec table. The rows stay in the HTML, so search engines still read them. */
export function SpecsDisclosure({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const contentId = useId();

  return (
    <div>
      <h4 className="font-display text-lg font-semibold">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={contentId}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-oak"
        >
          {label}
          <ChevronDown
            aria-hidden
            strokeWidth={1.75}
            className={`size-5 text-oak transition-transform duration-300 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
          />
        </button>
      </h4>
      {/* Animating grid rows from 0fr to 1fr slides the table open without measuring its height. */}
      <div
        id={contentId}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
