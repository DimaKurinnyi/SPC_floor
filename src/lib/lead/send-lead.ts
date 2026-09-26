"use server";

import { Resend } from "resend";
import { buildLeadEmail, buildPresentationEmail } from "./email-template";
import {
  leadSchema,
  presentationSchema,
  type LeadFormValues,
  type PresentationFormValues,
} from "./schema";

/** Anything faster than this after the form mounted is treated as a bot. */
const MIN_FILL_TIME_MS = 3000;

export type SendFailure = "validation" | "tooFast" | "send";
export type SendLeadResult = { ok: true } | { ok: false; error: SendFailure };

type SendMeta = {
  locale: string;
  /** Date.now() when the form was shown on the client. */
  startedAt: number;
  /** Honeypot field. Hidden from people, so only bots fill it. */
  website: string;
};

/** Returns a result to send back right away for bots, or null for a real visitor. */
function screenBots(meta: SendMeta): SendLeadResult | null {
  // Pretend success so bots get no signal that they were filtered out.
  if (meta.website) return { ok: true };
  if (Date.now() - meta.startedAt < MIN_FILL_TIME_MS) return { ok: false, error: "tooFast" };
  return null;
}

async function deliver(email: { subject: string; html: string; text: string; replyTo?: string }): Promise<SendLeadResult> {
  const { RESEND_API_KEY, LEAD_TO_EMAIL, LEAD_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !LEAD_TO_EMAIL || !LEAD_FROM_EMAIL) {
    console.error("sendLead: RESEND_API_KEY, LEAD_TO_EMAIL and LEAD_FROM_EMAIL must be set");
    return { ok: false, error: "send" };
  }

  const resend = new Resend(RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: LEAD_FROM_EMAIL,
    to: LEAD_TO_EMAIL.split(",").map((address) => address.trim()),
    ...email,
  });

  if (error) {
    console.error("sendLead: Resend rejected the email", error);
    return { ok: false, error: "send" };
  }
  return { ok: true };
}

const emailLocale = (locale: string) => (locale === "en" ? "en" : "pl");

/** The full inquiry form. Replies go straight to the client's email. */
export async function sendLead(values: LeadFormValues, meta: SendMeta): Promise<SendLeadResult> {
  const screened = screenBots(meta);
  if (screened) return screened;

  const parsed = leadSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "validation" };

  return deliver({
    ...buildLeadEmail(parsed.data, emailLocale(meta.locale)),
    replyTo: parsed.data.email,
  });
}

/** The short sample-presentation dialog: name and phone, no email to reply to. */
export async function sendPresentationRequest(
  values: PresentationFormValues,
  meta: SendMeta,
): Promise<SendLeadResult> {
  const screened = screenBots(meta);
  if (screened) return screened;

  const parsed = presentationSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "validation" };

  return deliver(buildPresentationEmail(parsed.data, emailLocale(meta.locale)));
}
