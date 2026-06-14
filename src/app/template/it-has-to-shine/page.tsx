import type { Metadata } from "next";
import { TemplateInTraining } from "@/components/template/TemplateInTraining";

export const metadata: Metadata = {
  title: "It Has To Shine — Mouvoir",
  description: "It Has To Shine template — still in training.",
};

export default function ItHasToShinePage() {
  return <TemplateInTraining folder="it_has_to_shine" title="It Has To Shine" />;
}
