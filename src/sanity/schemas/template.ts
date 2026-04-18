import { defineField, defineType } from "sanity";

export const templateSchema = defineType({
  name: "template",
  title: "Template",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "thumbnail", title: "Thumbnail", type: "image", options: { hotspot: true } }),
    defineField({ name: "videoTutorial", title: "Tutorial Video URL", type: "url" }),
    defineField({ name: "schemaImage", title: "Schema Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "downloadFile", title: "Download File", type: "file" }),
    defineField({
      name: "materials",
      title: "Required Materials",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime" }),
  ],
  preview: {
    select: { title: "title", media: "thumbnail" },
  },
});
