import type { Metadata } from "next";
import { TemplateInTraining } from "@/components/template/TemplateInTraining";

export const metadata: Metadata = {
  title: "Mirror Mirror — Mouvoir",
  description: "Mirror Mirror template — still in training.",
};

export default function MirrorMirrorPage() {
  return <TemplateInTraining folder="mirror_mirror" title="Mirror Mirror" />;
}
