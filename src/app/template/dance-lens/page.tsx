import type { Metadata } from "next";
import { TemplateScene } from "@/components/template/TemplateScene";
import { danceLensScene } from "@/components/template/danceLensLayout";

export const metadata: Metadata = {
  title: "Dance Lens — Mouvoir",
  description:
    "Dance Lens tutorial: be the star! Capture your silhouette or skeleton using the MediaPipe plugin.",
};

export default function DanceLensPage() {
  return <TemplateScene layout={danceLensScene} />;
}
