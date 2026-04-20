import { defineField, defineType } from "sanity";

export const assetSchema = defineType({
  name: "mediaAsset",
  title: "Media Asset",
  type: "document",
  fields: [
    defineField({
      name: "videoName",
      title: "Video name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "videoName", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "creator", title: "Creator name", type: "string" }),
    defineField({ name: "credit", title: "Mention / credit", type: "string" }),
    defineField({ name: "comment", title: "Comment", type: "text", rows: 3 }),
    defineField({
      name: "video",
      title: "Video file",
      type: "file",
      options: { accept: "video/*" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "publishedAt", title: "Published at", type: "datetime" }),
  ],
  preview: {
    select: { title: "videoName", subtitle: "creator" },
  },
});
