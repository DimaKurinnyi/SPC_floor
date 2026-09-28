"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { CircleCheck, ChevronDown } from "lucide-react";
import { buttonClasses } from "@/components/ui/button-styles";
import {
  INTERESTS,
  INVESTMENT_TYPES,
  leadFormDefaults,
  leadSchema,
  type LeadFormValues,
} from "@/lib/lead/schema";
import { sendLead, type SendFailure } from "@/lib/lead/send-lead";
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
} from "./form-parts";
import { useLeadForm } from "./LeadFormContext";

export function LeadForm() {
  const t = useTranslations("form");
  const locale = useLocale();
  const errorText = useErrorText();
  const guard = useBotGuard();
  const { preselection } = useLeadForm();
  const [failure, setFailure] = useState<SendFailure | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const uid = useId();
  const fieldId = (name: string) => `${uid}-${name}`;

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: leadFormDefaults,
    mode: "onTouched",
  });

  // A CTA elsewhere on the page asked for a prefill: tick its interest without unticking others,
  // and pick its investment type.
  useEffect(() => {
    if (!preselection) return;
    const { interest, investmentType } = preselection;
    const current = getValues("interests");
    if (interest && !current.includes(interest)) {
      setValue("interests", [...current, interest], { shouldDirty: true });
    }
    if (investmentType) setValue("investmentType", investmentType, { shouldDirty: true });
  }, [preselection, getValues, setValue]);

  useEffect(() => {
    if (sentTo) successRef.current?.focus();
  }, [sentTo]);

  const investmentType = useWatch({ control, name: "investmentType" });

  const submit = async (values: LeadFormValues) => {
    setFailure(null);
    const result = await sendLead(values, { locale, ...guard.meta() });
    if (result.ok) {
      setSentTo(values.email);
      reset(leadFormDefaults);
    } else {
      setFailure(result.error);
    }
  };

  if (sentTo) {
    return (
      <div role="status" className="rounded-plank border border-hairline bg-surface-raised p-8 sm:p-10">
        <CircleCheck aria-hidden className="size-10 text-success" strokeWidth={1.5} />
        <h3 ref={successRef} tabIndex={-1} className="mt-6 font-display text-2xl font-semibold focus:outline-none">
          {t("success.title")}
        </h3>
        <p className="mt-3 text-muted">{t("success.text", { email: sentTo })}</p>
        <button
          type="button"
          onClick={() => {
            setSentTo(null);
            guard.restart();
          }}
          className={buttonClasses("secondary", "mt-8")}
        >
          {t("success.again")}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => handleSubmit(submit)(event)}
      noValidate
      className="rounded-plank border border-hairline bg-surface-raised p-6 sm:p-10"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={fieldId("name")} label={t("fields.name.label")} error={errorText(errors.name?.message)} wide>
          {(a11y) => <input {...a11y} {...register("name")} type="text" autoComplete="name" className={controlClasses} />}
        </Field>

        <Field
          id={fieldId("phone")}
          label={t("fields.phone.label")}
          required={t("required")}
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

        <Field
          id={fieldId("email")}
          label={t("fields.email.label")}
          required={t("required")}
          error={errorText(errors.email?.message)}
        >
          {(a11y) => (
            <input
              {...a11y}
              {...register("email")}
              type="email"
              autoComplete="email"
              placeholder={t("fields.email.placeholder")}
              className={controlClasses}
            />
          )}
        </Field>

        <Field id={fieldId("investmentType")} label={t("fields.investmentType.label")}>
          {(a11y) => (
            <div className="relative">
              <select {...a11y} {...register("investmentType")} className={`${controlClasses} appearance-none pr-12`}>
                <option value="">{t("fields.investmentType.placeholder")}</option>
                {INVESTMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {t(`fields.investmentType.options.${type}`)}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden
                className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-muted"
              />
            </div>
          )}
        </Field>

        <Field id={fieldId("area")} label={t("fields.area.label")} error={errorText(errors.area?.message)}>
          {(a11y) => (
            <input
              {...a11y}
              {...register("area")}
              type="text"
              inputMode="numeric"
              placeholder={t("fields.area.placeholder")}
              className={controlClasses}
            />
          )}
        </Field>

        <AnimatePresence initial={false}>
          {investmentType === "other" ? (
            <motion.div
              key="other"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden sm:col-span-2"
            >
              <Field
                id={fieldId("investmentTypeOther")}
                label={t("fields.investmentTypeOther.label")}
                required={t("required")}
                error={errorText(errors.investmentTypeOther?.message)}
              >
                {(a11y) => (
                  <input {...a11y} {...register("investmentTypeOther")} type="text" className={controlClasses} />
                )}
              </Field>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <fieldset className="sm:col-span-2">
          <legend className="mb-3 text-sm font-medium">{t("fields.interests.legend")}</legend>
          <div className="grid gap-3">
            {INTERESTS.map((interest) => (
              <label key={interest} className="flex cursor-pointer items-start gap-3 text-muted hover:text-ink">
                <input
                  {...register("interests")}
                  type="checkbox"
                  value={interest}
                  className="mt-0.5 size-5 shrink-0 cursor-pointer accent-amber"
                />
                <span>{t(`fields.interests.options.${interest}`)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <Field
          id={fieldId("message")}
          label={t("fields.message.label")}
          error={errorText(errors.message?.message)}
          wide
        >
          {(a11y) => <textarea {...a11y} {...register("message")} rows={4} className={`${controlClasses} resize-y`} />}
        </Field>

        <ConsentField
          id={fieldId("consent")}
          registration={register("consent")}
          label={t.rich("fields.consent.label", { link: privacyLink })}
          error={errorText(errors.consent?.message)}
          className="sm:col-span-2"
        />

        <Honeypot id={fieldId("website")} inputRef={guard.websiteRef} />
      </div>

      {failure ? <FormFailure failure={failure} className="mt-8" /> : null}

      <SubmitButton pending={isSubmitting} label={t("submit")} className="mt-8 w-full sm:w-auto" />
    </form>
  );
}
