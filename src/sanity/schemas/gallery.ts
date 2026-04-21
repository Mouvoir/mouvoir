import { defineField, defineType } from "sanity";

export const gallerySchema = defineType({
  name: "galleryEntry",
  title: "Gallery Entry",
  type: "document",
  fields: [
    defineField({ name: "vjName", title: "VJ Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "vjName" }, validation: (r) => r.required() }),
    defineField({ name: "date", title: "Event Date & Location", type: "string" }),
    defineField({ name: "templateSlug", title: "Template", type: "string" }),
    defineField({ name: "thumbnail", title: "Thumbnail", type: "image", options: { hotspot: true } }),
    defineField({ name: "quote", title: "Quote / Testimonial", type: "text", rows: 3 }),
    defineField({ name: "eventType", title: "Event Type", type: "string" }),
    defineField({ name: "mediaFile", title: "Set Media File", type: "file" }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime" }),
  ],
  preview: {
    select: { title: "vjName", media: "thumbnail" },
  },
});
