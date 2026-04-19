import { getTranslations, setRequestLocale } from "next-intl/server";
import { AddImageBankButton } from "@/components/AddImageBankButton";
import { Nav } from "@/components/Nav";

const PLAY_ICON = (
  <svg
    viewBox="0 0 80 80"
    fill="#000"
    aria-hidden="true"
    className="w-[80px] h-[80px] drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
  >
    <polygon points="22,14 66,40 22,66" />
  </svg>
);

export default async function ImageBankPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ImageBank");

  return (
    <div className="page-shell">
      <div className="page-content">
        <Nav />

        <div className="flex items-end justify-between gap-6 mb-3">
          <h1 className="h-page" style={{ marginBottom: 0 }}>
            {t("title")}
          </h1>
          <AddImageBankButton />
        </div>
        <p className="subline">{t("subline")}</p>

        <div className="grid grid-cols-3 gap-8 mt-8">
          <article className="flex flex-col">
            <div className="w-full aspect-video rounded-[4px] overflow-hidden bg-[#111] relative">
              <div className="w-full h-full bg-white relative">
                <div
                  aria-hidden="true"
                  className="absolute"
                  style={{
                    inset: "10% 20% 5% 25%",
                    background:
                      "linear-gradient(180deg, #b93268 0%, #8a1c45 40%, #2a2a2a 70%)",
                    borderRadius: "40% 40% 10% 10%",
                  }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {PLAY_ICON}
              </div>
            </div>
            <h2 className="text-[22px] font-bold mt-[18px] mb-[6px]">
              {t("groovyDanceTitle")}
            </h2>
            <p className="text-[15px] max-w-[48ch] mb-[14px]">
              {t("groovyDanceCredit")}
            </p>
            <div className="flex gap-3 flex-wrap mt-3">
              <button type="button" className="btn-outline">
                {t("downloadButton")}
              </button>
            </div>
          </article>

          <article className="flex flex-col">
            <div className="w-full aspect-video rounded-[4px] overflow-hidden bg-[#111] relative">
              <div
                className="w-full h-full relative"
                style={{
                  background:
                    "repeating-linear-gradient(90deg, #6e48bd 0px, #6e48bd 8px, #3cc1c1 8px, #3cc1c1 16px, #c5d055 16px, #c5d055 24px, #d86fd0 24px, #d86fd0 32px, #5e9bd6 32px, #5e9bd6 40px)",
                }}
              >
                <div
                  aria-hidden="true"
                  className="absolute"
                  style={{
                    left: "40%",
                    top: "8%",
                    bottom: "4%",
                    width: "28%",
                    background: "#111",
                    clipPath:
                      "polygon(40% 0, 60% 0, 100% 30%, 70% 100%, 30% 100%, 0 30%)",
                  }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {PLAY_ICON}
              </div>
            </div>
            <h2 className="text-[22px] font-bold mt-[18px] mb-[6px]">
              {t("danceClubTitle")}
            </h2>
            <p className="text-[15px] max-w-[48ch] mb-[14px]">
              {t("danceClubCredit")}
            </p>
            <div className="flex gap-3 flex-wrap mt-3">
              <button type="button" className="btn-outline">
                {t("downloadButton")}
              </button>
            </div>
          </article>

          <article className="flex flex-col">
            <div className="w-full aspect-video rounded-[4px] overflow-hidden bg-[#111] relative">
              <div
                className="w-full h-full relative"
                style={{
                  background:
                    "radial-gradient(circle at 50% 60%, rgba(0, 0, 0, 0.55) 0%, transparent 40%), linear-gradient(135deg, #a3c2bb 0%, #b7b9a6 50%, #8b97b8 100%)",
                }}
              >
                <div
                  aria-hidden="true"
                  className="absolute"
                  style={{
                    left: "10%",
                    bottom: "15%",
                    width: "30%",
                    height: 4,
                    background: "#e84060",
                    filter: "blur(2px)",
                  }}
                />
                <div
                  aria-hidden="true"
                  className="absolute"
                  style={{
                    right: "6%",
                    bottom: "20%",
                    width: "34%",
                    height: 4,
                    background: "#f5c134",
                    filter: "blur(2px)",
                  }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {PLAY_ICON}
              </div>
            </div>
          </article>

          <article className="flex flex-col">
            <div className="w-full aspect-video rounded-[4px] overflow-hidden bg-[#111] relative">
              <div
                className="w-full h-full relative"
                style={{ background: "#f2f2f2" }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                      "radial-gradient(circle at 10% 30%, #333 2px, transparent 3px), radial-gradient(circle at 22% 55%, #a22 2px, transparent 3px), radial-gradient(circle at 36% 40%, #26a 2px, transparent 3px), radial-gradient(circle at 52% 62%, #383 2px, transparent 3px), radial-gradient(circle at 68% 38%, #e7a 2px, transparent 3px), radial-gradient(circle at 80% 60%, #a73 2px, transparent 3px), radial-gradient(circle at 92% 42%, #333 2px, transparent 3px)",
                    backgroundSize: "90px 90px",
                  }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {PLAY_ICON}
              </div>
            </div>
          </article>

          <article className="flex flex-col">
            <div className="w-full aspect-video rounded-[4px] overflow-hidden bg-[#111] relative">
              <div
                className="w-full h-full"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, #a9e9db 0%, #a9e9db 40%, transparent 41%), linear-gradient(180deg, #f6b0c8 0%, #f2a3bd 100%)",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {PLAY_ICON}
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
