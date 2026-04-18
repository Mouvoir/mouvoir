import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { sanityConfig } from "./src/sanity/config";

export default defineConfig({
  ...sanityConfig,
  name: "partycule",
  title: "Partycule Studio",
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
