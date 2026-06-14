import type { Metadata } from "next";
import { TemplateInTraining } from "@/components/template/TemplateInTraining";

export const metadata: Metadata = {
  title: "Shade & Shape — Mouvoir",
  description: "Shade & Shape template — still in training.",
};

export default function ShadeAndShapePage() {
  return <TemplateInTraining folder="shade_and_shape" title="Shade & Shape" />;
}
