"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { LeadFormProvider } from "@/components/lead-form/LeadFormContext";
import { PresentationDialogProvider } from "@/components/presentation/PresentationDialog";

export function Providers({ children }: { children: ReactNode }) {
  return (
    // "user": follow the OS reduced-motion setting, dropping movement but keeping fades.
    <MotionConfig reducedMotion="user">
      <LeadFormProvider>
        <PresentationDialogProvider>{children}</PresentationDialogProvider>
      </LeadFormProvider>
    </MotionConfig>
  );
}
