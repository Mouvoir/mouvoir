import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "@/sanity/schemaTypes";
import { sanityConfig } from "@/sanity/config";

export default defineConfig({
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
  apiVersion: sanityConfig.apiVersion,
  name: "partycule",
  title: "Partycule Studio",
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
