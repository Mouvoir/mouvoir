import { defineField, defineType } from "sanity";

export const assetSchema = defineType({
  name: "mediaAsset",
  title: "Media Asset",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "assetType",
      title: "Asset Type",
      type: "string",
      options: { list: ["video", "image", "gradient", "texture", "other"] },
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "file", title: "File", type: "file" }),
    defineField({ name: "thumbnail", title: "Thumbnail", type: "image", options: { hotspot: true } }),
    defineField({ name: "license", title: "License", type: "string" }),
    defineField({ name: "author", title: "Author", type: "string" }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime" }),
  ],
  preview: {
    select: { title: "title", media: "thumbnail" },
  },
});
