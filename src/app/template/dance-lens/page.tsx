import type { Metadata } from "next";
import { DanceLensView } from "@/components/template/DanceLensView";

export const metadata: Metadata = {
  title: "Dance Lens — Mouvoir",
  description:
    "Dance Lens tutorial: be the star! Capture your silhouette or skeleton using the MediaPipe plugin.",
};

export default function DanceLensPage() {
  return <DanceLensView />;
}
