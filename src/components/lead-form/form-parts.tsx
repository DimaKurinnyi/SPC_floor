"use client";

import { useEffect, useRef, type ReactNode, type Ref } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { LoaderCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { company } from "@/content/company";
import { buttonClasses } from "@/components/ui/button-styles";
import type { LeadErrorKey } from "@/lib/lead/schema";
import type { SendFailure } from "@/lib/lead/send-lead";

// Shared building blocks for the lead form and the sample-presentation dialog.

export const controlClasses =
  "w-full rounded-plank border border-field-border bg-graphite px-4 py-3 text-base text-paper placeholder:text-faint transition-colors hover:border-muted aria-invalid:border-danger";

/** Translates a schema error key (see LeadErrorKey) into the current language. */
export function useErrorText() {
  const t = useTranslations("form");
  return (key: string | undefined) => (key ? t(`errors.${key as LeadErrorKey}`) : undefined);
}

/**
 * Honeypot and fill-time data for the server action. Read `meta()` only in event handlers.
 * Call `restart()` when a form is shown again after a submission.
 */
export function useBotGuard() {
  const startedAt = useRef(0);
  const websiteRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  return {
    websiteRef,
    restart: () => {
      startedAt.current = Date.now();
    },
    meta: () => ({ startedAt: startedAt.current, website: websiteRef.current?.value ?? "" }),
  };
}

type FieldA11yProps = {
  id: string;
  "aria-invalid"?: boolean;
  "aria-required"?: boolean;
  "aria-describedby"?: string;
};

type FieldProps = {
  id: string;
  label: string;
  /** Screen-reader text for required fields; its presence marks the field as required. */
  required?: string;
  error?: string;
  wide?: boolean;
  children: (a11y: FieldA11yProps) => ReactNode;
};

export function Field({ id, label, required, error, wide = false, children }: FieldProps) {
  const errorId = `${id}-error`;
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
        {required ? <RequiredMark text={required} /> : null}
      </label>
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-required": required ? true : undefined,
        "aria-describedby": error ? errorId : undefined,
      })}
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function RequiredMark({ text }: { text: string }) {
  return (
    <>
      <span aria-hidden className="text-oak">
        {" "}*
      </span>
      <span className="sr-only"> ({text})</span>
    </>
  );
}

/** Renders the `<link>` chunk of a consent message as a link to the privacy policy in a new tab. */
export const privacyLink = (chunks: ReactNode) => (
  <Link href="/privacy" target="_blank" className="text-paper underline underline-offset-4 hover:text-oak">
    {chunks}
  </Link>
);

type ConsentFieldProps = {
  id: string;
  registration: UseFormRegisterReturn;
  label: ReactNode;
  error?: string;
  className?: string;
};

/** Required RODO consent checkbox. */
export function ConsentField({ id, registration, label, error, className }: ConsentFieldProps) {
  const t = useTranslations("form");
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted">
        <input
          {...registration}
          type="checkbox"
          aria-required="true"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="mt-0.5 size-5 shrink-0 cursor-pointer accent-amber"
        />
        <span>
          {label}
          <RequiredMark text={t("required")} />
        </span>
      </label>
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Off-screen and out of the tab order, so only bots fill it in. */
export function Honeypot({ id, inputRef }: { id: string; inputRef: Ref<HTMLInputElement> }) {
  const t = useTranslations("form");
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor={id}>{t("fields.website.label")}</label>
      <input ref={inputRef} id={id} type="text" name="website" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function FormFailure({ failure, className = "" }: { failure: SendFailure; className?: string }) {
  const t = useTranslations("form");
  return (
    <p role="alert" className={`rounded-plank border border-danger/50 px-4 py-3 text-sm text-danger ${className}`}>
      {failure === "send"
        ? t("failure.send", { email: company.email, phone: company.phone })
        : t(`failure.${failure}`)}
    </p>
  );
}

export function SubmitButton({ pending, label, className = "" }: { pending: boolean; label: string; className?: string }) {
  const t = useTranslations("form");
  return (
    <button type="submit" disabled={pending} className={buttonClasses("primary", className)}>
      {pending ? (
        <>
          <LoaderCircle aria-hidden className="size-4 animate-spin" />
          {t("submitting")}
        </>
      ) : (
        label
      )}
    </button>
  );
}
