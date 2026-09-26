// Placeholder company data. Replace with the real values before launch:
// art. 206 KSH requires a sp. z o.o. to publish these details on its website.
export const company = {
  brand: "SPC Floor",
  legalName: "SPC Floor sp. z o.o.",
  address: {
    street: "ul. Przykładowa 1",
    postalCode: "00-000",
    city: "Warszawa",
  },
  court: "Sąd Rejonowy dla m.st. Warszawy w Warszawie, XIII Wydział Gospodarczy KRS",
  krs: "0000000000",
  nip: "0000000000",
  regon: "000000000",
  shareCapital: "5 000,00 zł",
  phone: "+48 000 000 000",
  email: "biuro@example.pl",
} as const;

export const companyAddress = `${company.address.street}, ${company.address.postalCode} ${company.address.city}`;

/** Digits and a leading plus only, for tel: links. */
export const companyPhoneHref = `tel:${company.phone.replace(/[^\d+]/g, "")}`;
