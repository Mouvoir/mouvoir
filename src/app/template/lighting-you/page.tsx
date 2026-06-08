import type { Metadata } from "next";
import { LightingYouView } from "@/components/template/LightingYouView";

export const metadata: Metadata = {
  title: "Lighting You — Mouvoir",
  description:
    "Lighting You tutorial: make your own light and highlight your set using makeup, tape and your phone flash.",
};

export default function LightingYouPage() {
  return <LightingYouView />;
}
