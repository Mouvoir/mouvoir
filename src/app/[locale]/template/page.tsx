import { getTranslations, setRequestLocale } from "next-intl/server";
import { AddTemplateButton } from "@/components/AddTemplateButton";
import { FullPageScroll } from "@/components/FullPageScroll";
import { Nav } from "@/components/Nav";
import { TemplateMosaicCard } from "@/components/TemplateMosaicCard";
import { TemplateScatterBoard } from "@/components/TemplateScatterBoard";
import { getAllTemplates } from "@/lib/templates";
import { getAllMaterials } from "@/lib/materials";
import { safeImageUrl } from "@/sanity/imageUrl";

export default async function TemplateListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("TemplateList");
  const [templates, materials] = await Promise.all([
    getAllTemplates(),
    getAllMaterials(),
  ]);
  const materialOptions = materials.map((m) => ({
    id: m.id,
    label: m.label,
    imageUrl: safeImageUrl(m.image, (b) => b.width(80).height(80).fit("crop")),
  }));

  const scatterItems = templates.map((tpl) => ({
    slug: tpl.slug,
    title: tpl.title,
    resultVideoUrl: tpl.resultVideoUrl,
    schemaUrl: safeImageUrl(tpl.schemaImage, (b) => b.width(640).fit("max")),
  }));

  return (
    <FullPageScroll
      ariaLabels={[t("title"), t("mosaicTitle")]}
      dotColor="rgba(0,0,0,0.3)"
    >
      <div className="page-shell template-fullpage-hero">
        <div className="page-content">
          <Nav />

          <section className="template-hero">
            <div className="template-hero__heading">
              <div>
                <h1 className="h-page" style={{ marginBottom: 0 }}>
                  {t("title")}
                </h1>
                <p className="subline" style={{ marginTop: 8 }}>
                  {t("introOne")}
                </p>
                <p className="subline">{t("introTwo")}</p>
              </div>
              <AddTemplateButton materialOptions={materialOptions} />
            </div>

            <TemplateScatterBoard items={scatterItems} />

            <span className="template-scroll-cue">{t("scrollHint")}</span>
          </section>
        </div>
      </div>

      <section className="template-section template-fullpage-mosaic">
        <div className="template-section__inner">
          <header className="template-section__head">
            <div>
              <p className="template-section__eyebrow">{t("mosaicEyebrow")}</p>
              <h2 className="h-page" style={{ marginBottom: 0 }}>
                {t("mosaicTitle")}
              </h2>
            </div>
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
    </FullPageScroll>
  );
}
