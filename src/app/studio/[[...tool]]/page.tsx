import { notFound } from "next/navigation";
import { SanityStudio } from "@/sanity/studio";

export const dynamic = "force-dynamic";

// The embedded Studio is dev-only: it 404s in production so it never ships on
// the public site. Edit content locally via `npm run dev` at /studio.
export default function StudioPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <SanityStudio />;
}
