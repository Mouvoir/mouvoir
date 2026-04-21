import { getTranslations, setRequestLocale } from "next-intl/server";
import { AddTemplateButton } from "@/components/AddTemplateButton";
import { Nav } from "@/components/Nav";
import { TemplateCard } from "@/components/TemplateCard";
import { getAllTemplates } from "@/lib/templates";

export default async function TemplateListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("TemplateList");
  const templates = await getAllTemplates();
  const materialOptions = [...new Set(templates.flatMap((tpl) => tpl.materials))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  return (
    <div className="page-shell">
      <div className="page-content">
        <Nav />

        <div className="flex items-end justify-between gap-6 mb-3">
          <h1 className="h-page" style={{ marginBottom: 0 }}>
            {t("title")}
          </h1>
          <AddTemplateButton materialOptions={materialOptions} />
        </div>
        <p className="subline">{t("introOne")}</p>
        <p className="subline">{t("introTwo")}</p>

        <div className="grid grid-cols-2 gap-12 mt-8">
          {templates.map((template) => (
            <TemplateCard
              key={template.slug}
              slug={template.slug}
              title={template.title}
              description={template.description}
              materials={template.materials}
              downloadUrl={template.downloadUrl}
              resultVideoUrl={template.resultVideoUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
