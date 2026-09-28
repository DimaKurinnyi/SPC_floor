type ButtonVariant = "primary" | "secondary";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-plank px-6 py-3 text-center font-display text-sm font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  // Graphite text on amber: 8.3:1. Amber is never used for text on graphite buttons.
  primary: "bg-amber text-graphite hover:bg-amber-hover",
  secondary: "border border-oak/60 text-paper hover:border-oak hover:bg-oak/10",
};

export function buttonClasses(variant: ButtonVariant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`.trim();
}
