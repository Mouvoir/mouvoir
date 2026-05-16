import { defineField, defineType } from "sanity";

export const gallerySchema = defineType({
  name: "galleryEntry",
  title: "Gallery Entry",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "author", title: "Author", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "type", title: "Type", type: "string", validation: (r) => r.required() }),
    defineField({ name: "date", title: "Date", type: "string", validation: (r) => r.required() }),
    defineField({ name: "place", title: "Place", type: "string", validation: (r) => r.required() }),
    defineField({ name: "event", title: "Event", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "link", title: "Link", type: "url" }),
    defineField({
      name: "mainPhoto",
      title: "Main Photo",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "photos",
      title: "Photos",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({ name: "templateSlug", title: "Template", type: "string" }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime" }),
  ],
  preview: {
    select: { title: "title", subtitle: "author", media: "mainPhoto" },
  },
});
