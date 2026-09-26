/** Section anchors on the home page, in page order. Keys match `nav.*` in messages/*.json. */
export const NAV_ITEMS = [
  { key: "products", hash: "products" },
  { key: "gallery", hash: "gallery" },
  { key: "decors", hash: "decors" },
  { key: "architects", hash: "architects" },
  { key: "process", hash: "process" },
] as const;

/** Section ids the nav highlights while they are on screen. Module-level, so hooks get a stable array. */
export const NAV_HASHES: readonly string[] = NAV_ITEMS.map((item) => item.hash);
