export type LogoVariant = "bleu_orange" | "orange"| "bleu";

// Fallback used for any route not matched below.
const DEFAULT_LOGO: LogoVariant = "orange";

// Exact pathname → logo variant.
const PATH_LOGO: Record<string, LogoVariant> = {
  "/": "bleu_orange",
  "/choreography-styles": "bleu",
  "/mouvoir-anatomy": "bleu",
};

// Route bases whose every sub-path inherits a fixed logo variant.
// Anything under these prefixes uses the given variant unless an exact
// PATH_LOGO entry matches first.
const PREFIX_LOGO: Record<string, LogoVariant> = {
  "/choreography-styles": "bleu",
};

// Per-slug overrides for dynamic routes. Keyed by the route base, then by slug.
// Takes precedence over PREFIX_LOGO; anything not listed falls back to the prefix.
const SLUG_LOGO: Record<string, Record<string, LogoVariant>> = {
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

  for (const base of Object.keys(PREFIX_LOGO)) {
    if (pathname.startsWith(`${base}/`)) return PREFIX_LOGO[base];
  }

  return DEFAULT_LOGO;
}
