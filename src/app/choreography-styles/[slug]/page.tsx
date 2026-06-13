import { notFound } from "next/navigation";
import { getChoreProject, getAllChoreSlugs } from "@/components/choreography/choreProjects";
import { ChoreLayer } from "@/components/choreography/ChoreLayer";
import styles from "../collage.module.css";

export default async function ChoreDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const layers = getChoreProject(slug);
  if (!layers) notFound();

  return (
    <div className={styles.collage}>
      <section className={styles.screen}>
        {layers.map((layer, index) => (
          <ChoreLayer key={`${layer.asset}-${index}`} layer={layer} />
        ))}
      </section>
    </div>
  );
}

export function generateStaticParams() {
  return getAllChoreSlugs().map((slug) => ({ slug }));
}
