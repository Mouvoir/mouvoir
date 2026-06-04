import type { Metadata } from "next";
import { PhoneMoveBoard } from "@/components/PhoneMoveBoard";

export const metadata: Metadata = {
  title: "Phone Move — Mouvoir",
};

// Bespoke collage detail page. This static segment intentionally overrides the
// generic /template/[slug] page for the "phone-move" slug.
export default function PhoneMovePage() {
  return <PhoneMoveBoard />;
}
