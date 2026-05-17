import { AddTemplateButton } from "@/components/AddTemplateButton";
import { TemplateMosaicCard } from "@/components/TemplateMosaicCard";
import { getAllTemplates } from "@/lib/templates";
import { getAllMaterials } from "@/lib/materials";
import { safeImageUrl } from "@/sanity/imageUrl";

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
    <section className="template-section">
      <div className="template-section__inner">
        <header className="template-section__head">
          <div>
            <p className="template-section__eyebrow">Tous les templates</p>
            <h1 className="h-page" style={{ marginBottom: 0 }}>
              Choisis ton template
            </h1>
          </div>
          <AddTemplateButton materialOptions={materialOptions} />
        </header>

        <div className="template-section__grid">
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
