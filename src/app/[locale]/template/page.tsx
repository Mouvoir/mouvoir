import { getTranslations, setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/Nav";
import { TemplateCard } from "@/components/TemplateCard";
import { Link } from "@/i18n/navigation";

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
  const tAdd = await getTranslations("TemplateAdd");

  return (
    <div className="page-shell">
      <div className="page-content">
        <Nav />

        <h1 className="h-page">{t("title")}</h1>
        <p className="subline">{t("introOne")}</p>
        <p className="subline">{t("introTwo")}</p>

        <div className="grid grid-cols-2 gap-12 mt-8">
          <article className="flex flex-col">
            <Link
              href="/template/add"
              className="block w-full aspect-video rounded-[4px] border-[1.5px] border-[#1a1a1a] bg-white relative"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <span
                  aria-hidden="true"
                  className="text-[180px] leading-none font-bold text-[#1a1a1a]"
                >
                  +
                </span>
                <span className="text-[20px] font-semibold text-[#1a1a1a]">
                  {tAdd("addTemplateCta")}
                </span>
              </div>
            </Link>
            <h2 className="text-[22px] font-bold mt-[18px] mb-[6px]">
              {tAdd("cardTitle")}
            </h2>
            <p className="text-[15px] text-[#1a1a1a] max-w-[48ch] mb-[14px]">
              {tAdd("cardBody")}
            </p>
          </article>

          {TEMPLATES.map((template) => (
            <TemplateCard key={template.slug} {...template} />
          ))}
        </div>
      </div>
    </div>
  );
}
