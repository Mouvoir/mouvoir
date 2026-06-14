import type { Metadata } from "next";
import { TemplateScene } from "@/components/template/TemplateScene";
import { phoneMoveScene } from "@/components/template/phoneMoveLayout";

export const metadata: Metadata = {
  title: "Phone Move — Mouvoir",
};

// Bespoke collage detail page. This static segment intentionally overrides the
// generic /template/[slug] page for the "phone-move" slug.
export default function PhoneMovePage() {
  return <TemplateScene layout={phoneMoveScene} />;
}
