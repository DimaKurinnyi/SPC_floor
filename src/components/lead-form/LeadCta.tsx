"use client";

import type { ReactNode } from "react";
import { buttonClasses } from "@/components/ui/button-styles";
import { LEAD_FORM_ID, useLeadForm, type LeadPrefill } from "./LeadFormContext";

type LeadCtaProps = LeadPrefill & {
  variant?: "primary" | "secondary";
  className?: string;
  children: ReactNode;
};

/** Scrolls to the lead form and fills in the given interest checkbox and/or investment type. */
export function LeadCta({ interest, investmentType, variant = "primary", className, children }: LeadCtaProps) {
  const { preselect } = useLeadForm();
  return (
    <a
      href={`#${LEAD_FORM_ID}`}
      onClick={() => preselect({ interest, investmentType })}
      className={buttonClasses(variant, className)}
    >
      {children}
    </a>
  );
}
