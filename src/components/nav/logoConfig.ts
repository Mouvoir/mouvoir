export type LogoVariant = "bleu_orange" | "orange";

// Fallback used for any route not matched below.
const DEFAULT_LOGO: LogoVariant = "orange";

// Exact pathname → logo variant.
const PATH_LOGO: Record<string, LogoVariant> = {
  "/": "bleu_orange",
};

// Per-slug overrides for dynamic routes. Keyed by the route base, then by slug.
// Anything not listed here falls back to DEFAULT_LOGO.
const SLUG_LOGO: Record<string, Record<string, LogoVariant>> = {
  "/template": {
    // "some-template-slug": "bleu_orange",
  },
  "/gallery": {
    // "some-gallery-slug": "bleu_orange",
  },
};

// Resolve the logo variant to display for a given pathname.
export function getLogoVariant(pathname: string): LogoVariant {
  const exact = PATH_LOGO[pathname];
  if (exact) return exact;

  for (const base of Object.keys(SLUG_LOGO)) {
    if (pathname.startsWith(`${base}/`)) {
      const slug = pathname.slice(base.length + 1).split("/")[0];
      const variant = SLUG_LOGO[base]?.[slug];
      if (variant) return variant;
    }
  }

  return DEFAULT_LOGO;
}
