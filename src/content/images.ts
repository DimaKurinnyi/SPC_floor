// Alt texts live in messages/*.json next to the section copy.
import type { StaticImageData } from "next/image";
import { collections, type CollectionPhoto } from "./collections";

// Temporary CC0 photo found through Openverse (StockSnap). Replace with a real project photo.
import heroCorridor from "../../public/images/placeholder/hero-corridor.jpg";

// Product photos taken from laminaut.vercel.app (locking-planks and stone-tile-inspired pages).
import floorsScene from "../../public/images/products/floors/scene.jpg";
import floorsMuskoka from "../../public/images/products/floors/muskoka.jpg";
import floorsAlanya from "../../public/images/products/floors/alanya.jpg";
import floorsFlorence from "../../public/images/products/floors/florence.jpg";
import floorsOntario from "../../public/images/products/floors/ontario.jpg";
import floorsSofia from "../../public/images/products/floors/sofia.jpg";
import floorsBursa from "../../public/images/products/floors/bursa.jpg";
import floorsDenver from "../../public/images/products/floors/denver.jpg";
import panelsScene from "../../public/images/products/panels/scene.jpg";
import panels23033 from "../../public/images/products/panels/23033.jpg";
import panels23138 from "../../public/images/products/panels/23138.jpg";
import panels23139 from "../../public/images/products/panels/23139.jpg";
import panels23140 from "../../public/images/products/panels/23140.jpg";

// Gallery: interiors from laminaut.vercel.app, plus CC0 office and showroom photos from Openverse
// (rawpixel) standing in until there are photos of real projects.
import galleryLivingGreyOak from "../../public/images/gallery/living-grey-oak.jpg";
import galleryOfficeOpenSpace from "../../public/images/gallery/office-open-space.jpg";
import galleryBathroomMarble from "../../public/images/gallery/bathroom-marble.jpg";
import galleryKitchenDining from "../../public/images/gallery/kitchen-dining.jpg";
import galleryShowroom from "../../public/images/gallery/showroom.jpg";
import galleryLivingLightGrey from "../../public/images/gallery/living-light-grey.jpg";
import galleryOfficeMeetingRoom from "../../public/images/gallery/office-meeting-room.jpg";
import galleryLivingDarkOak from "../../public/images/gallery/living-dark-oak.jpg";

// Certificate and material-safety badges from laminaut.vercel.app (healthy-home page).
import certIntertek from "../../public/images/certificate/2381f019-d3e5-4c9a-9249-338e402d50c8-w1600-o-768x398.jpg";
import certFormaldehydeFree from "../../public/images/certificate/inoar-formaldehyde-free2x-w960-o-768x268.jpg";
import certPhthalateFree from "../../public/images/certificate/orthologo-cmyk-w403-o.jpg";
import certAntibacterial from "../../public/images/certificate/antibacterial-logo-23-2148496587-w626-o-400x400.jpg";

/**
 * A decor swatch. The name is a collection name or decor code, shown as is in every language.
 * Photos, when present, are all the decors of that collection (see src/content/collections.ts).
 */
export type Swatch = { name: string; src: StaticImageData; photos?: CollectionPhoto[] };

export type GalleryCategory = "residential" | "office" | "commercial";

/** Gallery order is layout order: the first photo gets the large tile, the sixth the wide one. */
const gallery = [
  { id: "livingGreyOak", category: "residential", src: galleryLivingGreyOak },
  { id: "officeOpenSpace", category: "office", src: galleryOfficeOpenSpace },
  { id: "bathroomMarble", category: "residential", src: galleryBathroomMarble },
  { id: "kitchenDining", category: "residential", src: galleryKitchenDining },
  { id: "showroom", category: "commercial", src: galleryShowroom },
  { id: "livingLightGrey", category: "residential", src: galleryLivingLightGrey },
  { id: "officeMeetingRoom", category: "office", src: galleryOfficeMeetingRoom },
  { id: "livingDarkOak", category: "residential", src: galleryLivingDarkOak },
] as const satisfies { id: string; category: GalleryCategory; src: StaticImageData }[];

/** Badges in the Certificates section. Captions and alt texts are in `certificates.items.<id>`. */
const certificates = [
  { id: "intertek", src: certIntertek },
  { id: "formaldehydeFree", src: certFormaldehydeFree },
  { id: "phthalateFree", src: certPhthalateFree },
  { id: "antibacterial", src: certAntibacterial },
] as const satisfies { id: string; src: StaticImageData }[];

export const images = {
  hero: heroCorridor,
  gallery,
  certificates,
  products: {
    floors: {
      scene: floorsScene,
      swatches: [
        { name: "Muskoka", src: floorsMuskoka, photos: collections.muskoka },
        { name: "Alanya", src: floorsAlanya, photos: collections.alanya },
        { name: "Florence", src: floorsFlorence, photos: collections.florence },
        { name: "Ontario", src: floorsOntario, photos: collections.ontario },
        { name: "Sofia", src: floorsSofia, photos: collections.sofia },
        { name: "Bursa", src: floorsBursa, photos: collections.bursa },
        { name: "Denver", src: floorsDenver, photos: collections.denver },
      ] satisfies Swatch[],
    },
    panels: {
      scene: panelsScene,
      swatches: [
        { name: "23033-1", src: panels23033 },
        { name: "23138-2", src: panels23138 },
        { name: "23139-1", src: panels23139 },
        { name: "23140-1", src: panels23140 },
      ] satisfies Swatch[],
    },
  },
};
