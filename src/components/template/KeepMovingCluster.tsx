"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { AssetVideo } from "@/components/shared/AssetVideo";
import { KEEP_MOVING_PROJECTS } from "./keepMovingProjects";
import { revealVars } from "./sceneReveal";
import styles from "./keepMovingCluster.module.css";

interface KeepMovingClusterProps {
  /** The keep_moving sticker entry from the view's layout (position + media + link). */
  sticker: {
    folder: string;
    name: string;
    label: string;
    href?: string;
    top: number;
    left: number;
    width: number;
    delay?: number;
  };
  /** /template/<slug> this view belongs to — keys into KEEP_MOVING_PROJECTS. */
  templateSlug: string;
  /** Render order within the scene, drives the staggered entrance reveal. */
  index: number;
}

// Renders the "Keep Moving" sticker and, on hover, a fly-out column of the
// choreography projects made with this template — each its presentation clip,
// linking to /choreography-styles/<slug>.
export function KeepMovingCluster({
  sticker,
  templateSlug,
  index,
}: KeepMovingClusterProps) {
  const [open, setOpen] = useState(false);
  const projects = KEEP_MOVING_PROJECTS[templateSlug] ?? [];
  const href = sticker.href ?? "/choreography-styles";
  const wrapStyle: CSSProperties = {
    top: `${sticker.top}%`,
    left: `${sticker.left}%`,
    width: `${sticker.width}%`,
  };

  return (
    <div
      className={styles.wrap}
      style={wrapStyle}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={href}
        className={`${styles.anchor} scene-reveal`}
        style={revealVars(index, sticker.delay)}
        aria-label={sticker.label}
      >
        <AssetVideo folder={sticker.folder} name={sticker.name} />
      </Link>

      {projects.length > 0 && (
        <div
          className={`${styles.flyout} ${open ? styles.flyoutOpen : ""}`}
          aria-hidden={!open}
        >
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/choreography-styles/${project.slug}`}
              className={styles.thumb}
              aria-label={`${project.title} — voir le projet`}
            >
              <AssetVideo folder={project.folder} name={project.name} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
