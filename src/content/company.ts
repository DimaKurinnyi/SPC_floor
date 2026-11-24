// Company details shown in the footer, the contact section and the privacy policy.
// Art. 206 KSH requires a sp. z o.o. to publish its registry court, KRS, NIP and share capital
// on its website. Fields set to null are not shown: fill them in as soon as they are known.
export const company = {
  brand: "SPC Floor",
  legalName: "BE WITH LOCKS Sp. z o.o.",
  address: {
    street: "ul. Serbska 7C lok. 2",
    postalCode: "58-100",
    city: "Świdnica",
  },
  /** Registry court (sąd rejestrowy) keeping the KRS file: still to be confirmed. */
  court: null as string | null,
  krs: "0001230420",
  nip: "8842839285",
  /** REGON: to be added once confirmed. */
  regon: null as string | null,
  /** BDO register number: to be added after registration. */
  bdo: null as string | null,
  /** Share capital (kapitał zakładowy), e.g. "5 000,00 zł": still to be confirmed. */
  shareCapital: null as string | null,
  phone: "+48 735 008 598",
  email: "spcfloor1@gmail.com",
};

export const companyAddress = `${company.address.street}, ${company.address.postalCode} ${company.address.city}`;

/** Digits and a leading plus only, for tel: links. */
export const companyPhoneHref = `tel:${company.phone.replace(/[^\d+]/g, "")}`;
