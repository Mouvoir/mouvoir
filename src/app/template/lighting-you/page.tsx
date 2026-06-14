import type { Metadata } from "next";
import { TemplateScene } from "@/components/template/TemplateScene";
import { lightingYouScene } from "@/components/template/lightingYouLayout";

export const metadata: Metadata = {
  title: "Lighting You — Mouvoir",
  description:
    "Lighting You tutorial: make your own light and highlight your set using makeup, tape and your phone flash.",
};

export default function LightingYouPage() {
  return <TemplateScene layout={lightingYouScene} />;
}
