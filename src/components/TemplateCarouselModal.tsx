"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { MaterialChip } from "@/components/MaterialChip";
import { TemplateMosaicCard } from "@/components/TemplateMosaicCard";
import { safeImageUrl } from "@/sanity/imageUrl";
import type { GraphMaterial } from "@/components/TemplateMaterialGraph";
import type { Template } from "@/lib/templates";

interface TemplateCarouselModalProps {
  open: boolean;
  onClose: () => void;
  templates: Template[];
  connectedMaterials: GraphMaterial[];
}

export function TemplateCarouselModal({ open, onClose, templates, connectedMaterials }: TemplateCarouselModalProps) {
  const t = useTranslations("TemplateCarousel");
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (open) setIndex(0);
  }, [open, templates.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, templates.length]);

  if (!open) return null;

  const total = templates.length;
  const canGo = total > 1;
  const goPrev = () => {
    if (!canGo) return;
    setDirection(-1);
    setIndex((i) => (i - 1 + total) % total);
  };
  const goNext = () => {
    if (!canGo) return;
    setDirection(1);
    setIndex((i) => (i + 1) % total);
  };

  const current = templates[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("title")}
      className="carousel-modal__overlay"
      onClick={onClose}
    >
      <div className="carousel-modal__panel" onClick={(e) => e.stopPropagation()} style={{ position: "relative" }}>
        <button type="button" className="carousel-modal__close" aria-label={t("close")} onClick={onClose}>
          ×
        </button>

        <header className="carousel-modal__header">
          <h2 className="carousel-modal__title">{t("title")}</h2>
          {connectedMaterials.length > 0 ? (
            <div className="carousel-modal__chips">
              {connectedMaterials.map((m) => (
                <MaterialChip key={m.id} label={m.label} imageUrl={m.imageUrl} />
              ))}
            </div>
          ) : null}
        </header>

        {total === 0 ? (
          <p className="carousel-modal__empty">{t("empty")}</p>
        ) : (
          <>
            <div className="carousel-modal__viewport">
              <button
                type="button"
                className="carousel-modal__nav carousel-modal__nav--prev"
                aria-label={t("previous")}
                onClick={goPrev}
                disabled={!canGo}
              >
                ‹
              </button>
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={current.slug}
                  className="carousel-modal__slide"
                  custom={direction}
                  initial={{ opacity: 0, x: direction === 0 ? 0 : direction * 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -60 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  drag={canGo ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -50) goNext();
                    else if (info.offset.x > 50) goPrev();
                  }}
                >
                  <TemplateMosaicCard
                    slug={current.slug}
                    title={current.title}
                    description={current.description}
                    materials={current.materials.map((m) => ({
                      id: m.id,
                      label: m.label,
                      imageUrl: safeImageUrl(m.image, (b) => b.width(48).height(48).fit("crop")),
                    }))}
                    downloadUrl={current.downloadUrl}
                    resultVideoUrl={current.resultVideoUrl}
                    index={0}
                    size="lg"
                  />
                </motion.div>
              </AnimatePresence>
              <button
                type="button"
                className="carousel-modal__nav carousel-modal__nav--next"
                aria-label={t("next")}
                onClick={goNext}
                disabled={!canGo}
              >
                ›
              </button>
            </div>

            <div className="carousel-modal__dots">
              {templates.map((tpl, i) => (
                <button
                  key={tpl.slug}
                  type="button"
                  className={`carousel-modal__dot${i === index ? " carousel-modal__dot--active" : ""}`}
                  aria-label={t("goTo", { n: i + 1 })}
                  onClick={() => {
                    setDirection(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                />
              ))}
              <span className="carousel-modal__counter">{t("counter", { current: index + 1, total })}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
