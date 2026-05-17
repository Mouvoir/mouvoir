import { defineField, defineType } from "sanity";

export const materialSchema = defineType({
  name: "material",
  title: "Material",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "label", media: "image" },
  },
});
