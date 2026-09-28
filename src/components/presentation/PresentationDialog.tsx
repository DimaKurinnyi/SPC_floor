"use client";

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { CircleCheck, X } from "lucide-react";
import {
  ConsentField,
  Field,
  FormFailure,
  Honeypot,
  SubmitButton,
  controlClasses,
  privacyLink,
  useBotGuard,
  useErrorText,
} from "@/components/lead-form/form-parts";
import { buttonClasses } from "@/components/ui/button-styles";
import { presentationFormDefaults, presentationSchema, type PresentationFormValues } from "@/lib/lead/schema";
import { sendPresentationRequest, type SendFailure } from "@/lib/lead/send-lead";

const PresentationDialogContext = createContext<{ open: () => void } | null>(null);

export function usePresentationDialog() {
  const context = useContext(PresentationDialogContext);
  if (!context) throw new Error("usePresentationDialog must be used inside PresentationDialogProvider");
  return context;
}

/**
 * Renders the "book a sample presentation" dialog once for the whole page.
 * The native <dialog> gives focus trapping, Escape to close and an inert background.
 */
export function PresentationDialogProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("presentation");
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Bumped on every close, so the next opening shows a fresh, empty form.
  const [session, setSession] = useState(0);
  const titleId = useId();
  const leadId = useId();

  const open = useCallback(() => dialogRef.current?.showModal(), []);
  const close = useCallback(() => dialogRef.current?.close(), []);

  return (
    <PresentationDialogContext value={{ open }}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={leadId}
        onClose={() => setSession((value) => value + 1)}
        // A click on the dialog element itself (not its content) is a click on the backdrop.
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-plank border border-hairline bg-surface-raised p-0 text-ink backdrop:bg-black/75"
      >
        <div className="relative p-6 sm:p-8">
          <PresentationForm key={session} titleId={titleId} leadId={leadId} onDone={close} />
          {/* Last in the DOM so the dialog opens with focus on the first field, not on this button. */}
          <button
            type="button"
            onClick={close}
            aria-label={t("close")}
            className="absolute top-3 right-3 inline-flex size-11 items-center justify-center rounded-plank text-muted transition-colors hover:bg-surface hover:text-ink"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>
      </dialog>
    </PresentationDialogContext>
  );
}

type PresentationFormProps = { titleId: string; leadId: string; onDone: () => void };

function PresentationForm({ titleId, leadId, onDone }: PresentationFormProps) {
  const t = useTranslations("presentation");
  const tForm = useTranslations("form");
  const locale = useLocale();
  const errorText = useErrorText();
  const guard = useBotGuard();
  const [failure, setFailure] = useState<SendFailure | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const uid = useId();
  const fieldId = (name: string) => `${uid}-${name}`;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(presentationSchema),
    defaultValues: presentationFormDefaults,
    mode: "onTouched",
  });

  useEffect(() => {
    if (sentTo) successRef.current?.focus();
  }, [sentTo]);

  const submit = async (values: PresentationFormValues) => {
    setFailure(null);
    const result = await sendPresentationRequest(values, { locale, ...guard.meta() });
    if (result.ok) setSentTo(values.phone.trim());
    else setFailure(result.error);
  };

  if (sentTo) {
    return (
      <div role="status">
        <CircleCheck aria-hidden className="size-10 text-success" strokeWidth={1.5} />
        <h2
          id={titleId}
          ref={successRef}
          tabIndex={-1}
          className="mt-6 pr-12 font-display text-2xl font-semibold focus:outline-none"
        >
          {t("success.title")}
        </h2>
        <p id={leadId} className="mt-3 leading-relaxed text-muted">
          {t("success.text", { phone: sentTo })}
        </p>
        <button type="button" onClick={onDone} className={buttonClasses("secondary", "mt-8 w-full")}>
          {t("success.close")}
        </button>
      </div>
    );
  }

  return (
    <>
      <h2 id={titleId} className="pr-12 font-display text-2xl leading-tight font-semibold text-balance">
        {t("title")}
      </h2>
      <p id={leadId} className="mt-3 leading-relaxed text-muted">
        {t("lead")}
      </p>

      <form onSubmit={(event) => handleSubmit(submit)(event)} noValidate className="mt-8 grid gap-5">
        <Field id={fieldId("name")} label={t("fields.name.label")} error={errorText(errors.name?.message)}>
          {(a11y) => (
            <input {...a11y} {...register("name")} type="text" autoComplete="given-name" className={controlClasses} />
          )}
        </Field>

        <Field
          id={fieldId("phone")}
          label={t("fields.phone.label")}
          required={tForm("required")}
          error={errorText(errors.phone?.message)}
        >
          {(a11y) => (
            <input
              {...a11y}
              {...register("phone")}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder={t("fields.phone.placeholder")}
              className={controlClasses}
            />
          )}
        </Field>

        <ConsentField
          id={fieldId("consent")}
          registration={register("consent")}
          label={t.rich("fields.consent.label", { link: privacyLink })}
          error={errorText(errors.consent?.message)}
        />

        <Honeypot id={fieldId("website")} inputRef={guard.websiteRef} />

        {failure ? <FormFailure failure={failure} /> : null}

        <SubmitButton pending={isSubmitting} label={t("submit")} className="mt-2 w-full" />
      </form>
    </>
  );
}
