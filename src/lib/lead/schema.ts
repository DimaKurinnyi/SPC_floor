import { z } from "zod";

export const INVESTMENT_TYPES = [
  "developer",
  "contractor",
  "designOffice",
  "privateInvestor",
  "other",
] as const;

export const INTERESTS = [
  "wholesaleQuote",
  "samplePresentation",
  "technicalDocs",
] as const;

export type InvestmentType = (typeof INVESTMENT_TYPES)[number];
export type Interest = (typeof INTERESTS)[number];

/** Keys under `form.errors` in messages/*.json. Schema messages are these keys, translated in the UI. */
export type LeadErrorKey =
  | "nameTooLong"
  | "phoneRequired"
  | "phoneInvalid"
  | "emailRequired"
  | "emailInvalid"
  | "otherRequired"
  | "otherTooLong"
  | "areaInvalid"
  | "messageTooLong"
  | "consentRequired";

const err = (key: LeadErrorKey) => key;

/** Strips spaces, dashes, dots and brackets people type into phone numbers. */
export const normalizePhone = (value: string) => value.replace(/[\s\-().]/g, "");

const nameField = z.string().trim().max(120, err("nameTooLong"));
const phoneField = z
  .string()
  .trim()
  .min(1, { error: err("phoneRequired"), abort: true })
  .refine((v) => /^\+?\d{9,15}$/.test(normalizePhone(v)), err("phoneInvalid"));
const consentField = z.boolean().refine((v) => v, err("consentRequired"));

/** The full inquiry form in the contact section. */
export const leadSchema = z
  .object({
    name: nameField,
    phone: phoneField,
    email: z.string().trim().min(1, err("emailRequired")).pipe(z.email(err("emailInvalid"))),
    investmentType: z.union([z.enum(INVESTMENT_TYPES), z.literal("")]),
    investmentTypeOther: z.string().trim().max(120, err("otherTooLong")),
    area: z
      .string()
      .trim()
      .refine((v) => v === "" || (/^\d{1,7}$/.test(v) && Number(v) > 0), err("areaInvalid")),
    interests: z.array(z.enum(INTERESTS)),
    message: z.string().trim().max(2000, err("messageTooLong")),
    consent: consentField,
  })
  .superRefine((data, ctx) => {
    if (data.investmentType === "other" && data.investmentTypeOther === "") {
      ctx.addIssue({ code: "custom", path: ["investmentTypeOther"], message: err("otherRequired") });
    }
  });

export type LeadFormValues = z.input<typeof leadSchema>;

export const leadFormDefaults: LeadFormValues = {
  name: "",
  phone: "",
  email: "",
  investmentType: "",
  investmentTypeOther: "",
  area: "",
  interests: [],
  message: "",
  consent: false,
};

/** The short "book a sample presentation" dialog: name and phone only. */
export const presentationSchema = z.object({
  name: nameField,
  phone: phoneField,
  consent: consentField,
});

export type PresentationFormValues = z.input<typeof presentationSchema>;

export const presentationFormDefaults: PresentationFormValues = {
  name: "",
  phone: "",
  consent: false,
};
