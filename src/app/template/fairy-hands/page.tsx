import type { Metadata } from "next";
import { FairyHandsView } from "@/components/template/FairyHandsView";

// A bespoke tutorial layout for the "Fairy Hands" template. This static segment
// takes precedence over the sibling [slug] route, so every other template still
// falls through to the generic Sanity-driven detail page.
export const metadata: Metadata = {
  title: "Fairy Hands — Mouvoir",
  description:
    "Tutoriel Fairy Hands : utilisez vos mains comme contenu pour vos visuels.",
};

export default function FairyHandsPage() {
  return <FairyHandsView />;
}
