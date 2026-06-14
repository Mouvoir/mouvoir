import type { Metadata } from "next";
import { TemplateInTraining } from "@/components/template/TemplateInTraining";

export const metadata: Metadata = {
  title: "Motion Skeleton — Mouvoir",
  description: "Motion Skeleton template — still in training.",
};

export default function MotionSkeletonPage() {
  return <TemplateInTraining folder="motion_skeleton" title="Motion Skeleton" />;
}
