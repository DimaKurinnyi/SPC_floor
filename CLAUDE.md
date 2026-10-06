# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

B2B landing page for an SPC flooring importer (Polish sp. z o.o.). Its only job is collecting leads: a price quote for a project or an on-site sample presentation. Polish is the primary language, English is secondary.

Stack: Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS 4, next-intl 4, motion, lucide-react, react-hook-form + zod 4, Resend.

## Commands

- `npm run dev`: dev server on http://localhost:3000
- `npm run build`: production build. Both locales must show as `●` (SSG) in the route table
- `npm run lint`: ESLint, including the React Compiler rules (`react-hooks/refs`, `incompatible-library`)
- `npx tsc --noEmit`: type check, including typed translation keys

There is no test runner. Verify changes with lint, build and the running app.

Copy `.env.example` to `.env.local`. Without the Resend variables the form still validates, but sending fails with the "send" error message.

## Architecture

**i18n (next-intl).** Locales are `pl` (default, no URL prefix) and `en` (`/en`), defined in `src/i18n/routing.ts`. Locale detection and the locale cookie are off on purpose: `/` always opens Polish, whatever the browser language. The privacy policy states the site uses no cookies, so update it if one is ever added. The same file maps localized pathnames: `/privacy` is `/polityka-prywatnosci` in Polish and `/en/privacy-policy` in English. Always link with `Link` from `@/i18n/navigation`, never `next/link`. `src/proxy.ts` is Next 16's replacement for `middleware.ts`. `src/i18n/request.ts` reads the locale through `next/root-params`. The root layout is `src/app/[locale]/layout.tsx`; there is no `src/app/layout.tsx`.

**Copy.** All visible text lives in `messages/pl.json` and `messages/en.json`, which must have identical keys. `src/global.d.ts` types `t()` keys against `pl.json`, so a missing key fails `tsc`. Components iterate `as const` key arrays (e.g. `ITEMS` in `FactoryDirect.tsx`, `STEPS` in `Process.tsx`) that must match the message keys. Deleting a section means removing its component, its messages namespace in both files, and its entry in `nav-items.ts` if it has one. Company data (KRS, NIP, address and so on) lives in `src/content/company.ts` and photos in `src/content/images.ts`. Both are placeholders to be replaced with real data.

**Lead form.** `src/lib/lead/schema.ts` is the single zod schema, shared by the client (`zodResolver`) and the server action `src/lib/lead/send-lead.ts`. Schema error messages are keys under `form.errors`, translated in `LeadForm.tsx`. The server action rejects bots through a honeypot field (it fakes success) and a 3-second minimum fill time. It then sends through Resend to `LEAD_TO_EMAIL` with `replyTo` set to the client's email. The email (`email-template.ts`) is always in Polish and reuses labels from `messages/pl.json`.

**CTA → form.** `LeadFormContext` lets any `LeadCta` button prefill the form (`preselect({ interest?, investmentType? })`) and jump to `#contact`. Catalog buttons tick the wholesale quote; the architect zone picks "Biuro Projektowe". The Header CTA is a plain anchor.

**Nav.** `nav-items.ts` lists the header anchors in page order. `useActiveSection` is a scroll-spy (an `IntersectionObserver` on a thin band 40% down the viewport). `DesktopNav` and `MobileMenu` both use it to put `aria-current="location"` and a full-width oak underline on the current section's link; on hover the underline grows from the centre. Sections without a nav entry (factory, contact) leave no link active.

**Decors.** `Decors.tsx` (`#decors`) has one WAI-ARIA tab per product (arrow keys switch tabs). Each tab lists that product's swatches from `images.products.<id>.swatches` as offset strips, labelled with the catalog's `swatchPrefix` ("Kolekcja", "Dekor"). Adding a swatch to `images.ts` adds it both here and in the catalog gallery. A swatch with `photos` (all floor collections) is a button that opens every decor of that collection in the shared `Lightbox`. Those photos live in `public/images/collection/<name>/`; `src/content/collections.ts` is generated from that folder by `npm run images:collections`, so rerun it after adding or removing photos instead of editing the file.

**Gallery.** `Gallery.tsx` (`#gallery`) passes translated photos to `GalleryGrid.tsx`: a mosaic whose tile sizes depend on position (the first photo is large, the sixth wide; see `TILE_CLASSES`). Each tile opens the shared `Lightbox`. Photos and their categories are listed in `images.gallery`; titles and alt texts are in `gallery.items.<id>`.

**Certificates.** `Certificates.tsx` (`#certificates`, the last section, under the contact form) is a plain row of the badges listed in `images.certificates` (files in `public/images/certificate/`) on white tiles, with no visible heading; `certificates.title` is its `aria-label` and `certificates.items.<id>` the alt texts. The page order is set in `src/app/[locale]/page.tsx`: …, Process, Contact, Certificates.

**Lightbox.** `src/components/ui/Lightbox.tsx` is the full-screen photo viewer used by the gallery and by each catalog product (its main photo opens the interior shot plus all decors). It is a native `<dialog>` driven by a controlled `index: number | null`. Navigation works by swipe or drag (motion `drag="x"`), arrow keys, side buttons and a thumbnail strip. Photos are never enlarged past their file width, so the small decor strips stay sharp. Its strings are under `lightbox.*`.

**Sample-presentation dialog.** Every "Umów prezentację wzorników" button is a `PresentationCta` that opens one native `<dialog>` (`src/components/presentation/PresentationDialog.tsx`, mounted in `Providers.tsx`). The dialog holds a short form (name, phone, email, RODO consent) validated by `presentationSchema` and sent by the `sendPresentationRequest` server action. Both forms share their field, consent, honeypot and error pieces through `src/components/lead-form/form-parts.tsx`, and `send-lead.ts` shares bot screening and Resend delivery between the two actions.

**Motion.** `Reveal`, `RevealList` and `RevealItem` (`src/components/ui/Reveal.tsx`) handle scroll reveals. `MotionConfig reducedMotion="user"` in `Providers.tsx` handles reduced motion globally. The signature element is `PanelLayers.tsx`, an SVG exploded view of a panel whose layers separate on scroll. It takes `decor` (`wood`/`stone`) and `format` (`plank`/`tile`), and each instance gets unique pattern ids through `useId`. The layer labels are HTML (`<ol>`) laid over the SVG at positions computed from the drawing geometry, so they stay readable at any width. Keep them short: `GAP` is sized for two-line names on phones. Variants live on the wrapper `motion.div`, so the slabs, leader lines and labels share one state. Label order must match `LAYERS` in `Catalog.tsx` and the `catalog.products.*.layers` messages.

**Product catalog.** `Catalog.tsx` (`#products`, right after the hero) shows one WAI-ARIA tab per product through `ProductTabs.tsx` (arrow keys switch tabs; the panels are rendered on the server and passed in). Each panel holds the labelled layer drawing next to `ProductGallery` (an interior photo plus decor thumbnails that swap the main image), then the spec table, collapsed behind a "Zobacz specyfikację" button with a chevron (`SpecsDisclosure.tsx`; the rows stay in the HTML while closed). Product photos and swatch names live in `images.products` in `src/content/images.ts`. The table rows are read in order from `catalog.products.<id>.specs` via `useMessages()`, so rows are added or removed in the JSON only.

## Design rules

The design tokens are in `@theme` in `src/app/globals.css`. The contrast figures behind them are in the comment there.

- Amber `#D4AF37` is a button fill only, always with graphite text. White on amber fails contrast (2.1:1).
- Oak `#D4A373` is for thin accents: icons, markers, lines.
- Don't put gold or oak text on light backgrounds (about 2:1).

`buttonClasses()` includes `inline-flex`. To hide a button responsively, wrap it in an element that carries `hidden sm:block`. A `hidden` class on the button itself loses to `inline-flex`.

## Next 16 specifics seen here

- `next/image` takes `preload` instead of `priority`, and only quality 75 is allowed by default.
- `params` is a Promise. Use the generated `LayoutProps<"/[locale]">` and `PageProps<...>` types.
