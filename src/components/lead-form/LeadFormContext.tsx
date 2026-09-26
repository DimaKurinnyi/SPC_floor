"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { Interest, InvestmentType } from "@/lib/lead/schema";

export const LEAD_FORM_ID = "contact";

/** What a CTA asks the form to fill in before the visitor gets there. */
export type LeadPrefill = { interest?: Interest; investmentType?: InvestmentType };

/** `seq` changes on every request, so asking for the same prefill twice still applies it. */
type Preselection = (LeadPrefill & { seq: number }) | null;

type LeadFormContextValue = {
  preselection: Preselection;
  preselect: (prefill: LeadPrefill) => void;
};

const LeadFormContext = createContext<LeadFormContextValue | null>(null);

export function LeadFormProvider({ children }: { children: ReactNode }) {
  const [preselection, setPreselection] = useState<Preselection>(null);
  const preselect = useCallback((prefill: LeadPrefill) => {
    setPreselection((prev) => ({ ...prefill, seq: (prev?.seq ?? 0) + 1 }));
  }, []);

  return <LeadFormContext value={{ preselection, preselect }}>{children}</LeadFormContext>;
}

export function useLeadForm() {
  const context = useContext(LeadFormContext);
  if (!context) throw new Error("useLeadForm must be used inside LeadFormProvider");
  return context;
}
