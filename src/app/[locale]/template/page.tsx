import { getTranslations, setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/Nav";
import { TemplateCard } from "@/components/TemplateCard";

const TEMPLATES = [
  {
    slug: "just-dance",
    title: "Just Dance",
    description:
      "Détecte le mouvement de la foule via webcam et génère des visuels réactifs en temps réel. Compatible TouchDesigner.",
    material: "Touchdesigner, caméra IF",
    thumbnail: (
      <div
        className="w-full h-full"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, #a9e9db 0%, #a9e9db 46%, transparent 47%), linear-gradient(180deg, #f8c1d9 0%, #f6b0c8 100%)",
        }}
      />
    ),
  },
  {
    slug: "camping",
    title: "Camping",
    description:
      "Set-up précaire mais faisable dans toutes les situations, il vous suffit de votre ordinateur et c'est tout !",
    material: "Votre ordinateur",
    thumbnail: (
      <div
        className="w-full h-full"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, #f6b14b 0%, transparent 40%), linear-gradient(135deg, #173b1a 0%, #2f5e34 45%, #5b7a44 100%)",
        }}
      />
    ),
  },
];

export default async function TemplateListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("TemplateList");

  return (
    <div className="page-shell">
      <div className="page-content">
        <Nav />

        <h1 className="h-page">{t("title")}</h1>
        <p className="subline">{t("introOne")}</p>
        <p className="subline">{t("introTwo")}</p>

        <div className="grid grid-cols-2 gap-12 mt-8">
          {TEMPLATES.map((template) => (
            <TemplateCard key={template.slug} {...template} />
          ))}
        </div>
      </div>
    </div>
  );
}
