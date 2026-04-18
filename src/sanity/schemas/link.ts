import { defineField, defineType } from "sanity";

export const linkSchema = defineType({
  name: "usefulLink",
  title: "Useful Link",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "url", title: "URL", type: "url", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: ["tutorial", "plugin", "tool", "community", "other"] },
    }),
    defineField({ name: "icon", title: "Icon / Logo", type: "image" }),
  ],
  preview: {
    select: { title: "title", subtitle: "url" },
  },
});
