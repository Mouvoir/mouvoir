import type { Metadata } from "next";
import { TemplateInTraining } from "@/components/template/TemplateInTraining";

export const metadata: Metadata = {
  title: "Body Canvas — Mouvoir",
  description: "Body Canvas template — still in training.",
};

export default function BodyCanvasPage() {
  return <TemplateInTraining folder="body_canvas" title="Body Canvas" />;
}
