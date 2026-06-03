import { AddTemplateButton } from "@/components/AddTemplateButton";
import { TemplateMosaicCard } from "@/components/TemplateMosaicCard";
import { getAllTemplates } from "@/lib/templates";
import { getAllMaterials } from "@/lib/materials";
import { safeImageUrl } from "@/sanity/imageUrl";
import styles from "./template.module.css";

export default async function TemplateListPage() {
  const [templates, materials] = await Promise.all([
    getAllTemplates(),
    getAllMaterials(),
  ]);
  const materialOptions = materials.map((m) => ({
    id: m.id,
    label: m.label,
    imageUrl: safeImageUrl(m.image, (b) => b.width(80).height(80).fit("crop")),
  }));

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.head}>
          <AddTemplateButton materialOptions={materialOptions} />
        </header>

        <div className={styles.grid}>
          {templates.map((template, i) => (
            <TemplateMosaicCard
              key={template.slug}
              slug={template.slug}
              title={template.title}
              description={template.description}
              materials={template.materials.map((m) => ({
                id: m.id,
                label: m.label,
                imageUrl: safeImageUrl(m.image, (b) => b.width(48).height(48).fit("crop")),
              }))}
              downloadUrl={template.downloadUrl}
              resultVideoUrl={template.resultVideoUrl}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
