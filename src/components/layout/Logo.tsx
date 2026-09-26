import { company } from "@/content/company";

/** Temporary wordmark: three offset planks, as laid on a floor. Replace with the real logo. */
export function Logo() {
  return (
    <span className="inline-flex items-center gap-3">
      <svg aria-hidden viewBox="0 0 28 22" className="h-5 w-auto text-oak" fill="currentColor">
        <rect x="0" y="0" width="20" height="6" rx="1" />
        <rect x="8" y="8" width="20" height="6" rx="1" opacity="0.75" />
        <rect x="3" y="16" width="20" height="6" rx="1" opacity="0.5" />
      </svg>
      <span className="font-display text-lg font-semibold tracking-tight">{company.brand}</span>
    </span>
  );
}
