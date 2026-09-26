import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type SectionProps = {
  id: string;
  title: string;
  lead?: string;
  children: ReactNode;
  className?: string;
};

/** A page section with an h2 heading. The id doubles as the anchor used by the header menu. */
export function Section({ id, title, lead, children, className = "" }: SectionProps) {
  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className={`py-20 sm:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          <h2
            id={headingId}
            className="font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl"
          >
            {title}
          </h2>
          {lead ? <p className="mt-4 text-lg leading-relaxed text-muted text-pretty">{lead}</p> : null}
        </Reveal>
        <div className="mt-12 sm:mt-16">{children}</div>
      </div>
    </section>
  );
}
