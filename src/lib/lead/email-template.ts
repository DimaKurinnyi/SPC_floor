import pl from "../../../messages/pl.json";
import { normalizePhone, type LeadFormValues, type PresentationFormValues } from "./schema";

// The sales team reads Polish, so emails always use the Polish labels from messages/pl.json.
const fields = pl.form.fields;
const presentationFields = pl.presentation.fields;

const LOCALE_NAMES: Record<string, string> = { pl: "polski", en: "angielski" };

type Row = [label: string, value: string];

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Renders a label/value table as HTML and plain text. Empty values are left out. */
function renderEmail(subject: string, rows: Row[], note: string) {
  const filled = rows.filter(([, value]) => value !== "");

  const html = `<!doctype html>
<html lang="pl">
  <body style="margin:0;padding:24px;background:#f8f9fa;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a">
    <h1 style="margin:0 0 16px;font-size:20px">${escapeHtml(subject)}</h1>
    <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;background:#ffffff;max-width:640px;width:100%">
      ${filled
        .map(
          ([label, value]) => `<tr>
        <th align="left" valign="top" style="border-bottom:1px solid #e5e5e5;width:40%;font-weight:600">${escapeHtml(label)}</th>
        <td valign="top" style="border-bottom:1px solid #e5e5e5;white-space:pre-line">${escapeHtml(value)}</td>
      </tr>`,
        )
        .join("\n      ")}
    </table>
    <p style="margin:16px 0 0;font-size:13px;color:#555">${escapeHtml(note)}</p>
  </body>
</html>`;

  const text = [subject, "", ...filled.map(([label, value]) => `${label}: ${value}`), "", note].join("\n");

  return { subject, html, text };
}

function investmentTypeLabel(lead: LeadFormValues) {
  if (lead.investmentType === "") return "";
  const label = fields.investmentType.options[lead.investmentType];
  return lead.investmentType === "other" && lead.investmentTypeOther
    ? `${label}: ${lead.investmentTypeOther}`
    : label;
}

export function buildLeadEmail(lead: LeadFormValues, locale: string) {
  const type = investmentTypeLabel(lead);
  const area = lead.area ? `${lead.area} m²` : "";
  const subjectDetails = [type, area].filter(Boolean).join(", ");
  const subject = `Nowe zapytanie B2B: ${lead.name || lead.email}${subjectDetails ? ` (${subjectDetails})` : ""}`;

  return renderEmail(
    subject,
    [
      [fields.name.label, lead.name],
      [fields.phone.label, normalizePhone(lead.phone)],
      [fields.email.label, lead.email],
      [fields.investmentType.label, type],
      [fields.area.label, area],
      [
        fields.interests.legend,
        lead.interests.map((interest) => fields.interests.options[interest]).join("; "),
      ],
      [fields.message.label, lead.message],
      ["Język formularza", LOCALE_NAMES[locale] ?? locale],
    ],
    "Odpowiedz na tę wiadomość, aby napisać bezpośrednio do klienta.",
  );
}

export function buildPresentationEmail(request: PresentationFormValues, locale: string) {
  const phone = normalizePhone(request.phone);
  const subject = `Prośba o prezentację wzorników: ${request.name || phone}`;

  return renderEmail(
    subject,
    [
      [presentationFields.name.label, request.name],
      [presentationFields.phone.label, phone],
      [presentationFields.email.label, request.email],
      ["Język formularza", LOCALE_NAMES[locale] ?? locale],
    ],
    "Zadzwoń albo odpowiedz na tę wiadomość, aby ustalić z klientem termin i miejsce prezentacji.",
  );
}
