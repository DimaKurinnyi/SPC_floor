"use client";

import type { ReactNode } from "react";
import { buttonClasses } from "@/components/ui/button-styles";
import { usePresentationDialog } from "./PresentationDialog";

type PresentationCtaProps = {
  variant?: "primary" | "secondary";
  className?: string;
  children: ReactNode;
};

/** Opens the short "book a sample presentation" dialog. */
export function PresentationCta({ variant = "primary", className, children }: PresentationCtaProps) {
  const { open } = usePresentationDialog();
  return (
    <button type="button" aria-haspopup="dialog" onClick={open} className={buttonClasses(variant, className)}>
      {children}
    </button>
  );
}
