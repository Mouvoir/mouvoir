"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GalleryCard } from "./GalleryCard";
import type { GalleryEntry } from "@/lib/gallery";
import styles from "./GalleryMosaic.module.css";

const ALL_TYPES_LABEL = "TOUS LES TYPES";

interface GalleryMosaicProps {
  entries: GalleryEntry[];
}

export function GalleryMosaic({ entries }: GalleryMosaicProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const availableTypes = useMemo(() => {
    const set = new Set<string>();
    for (const entry of entries) {
      if (entry.type) set.add(entry.type);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [entries]);

  const filteredEntries = useMemo(() => {
    if (!selectedType) return entries;
    return entries.filter((entry) => entry.type === selectedType);
  }, [entries, selectedType]);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onClickOutside);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClickOutside);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const triggerLabel = selectedType ? selectedType.toUpperCase() : ALL_TYPES_LABEL;

  const handleSelect = (type: string | null) => {
    setSelectedType(type);
    setOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-start mb-6">
        <div ref={containerRef} className={styles.filter}>
          <button
            type="button"
            className="btn-iridescent btn-iridescent--filter"
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {triggerLabel}
          </button>
          {open ? (
            <div className={styles.menu} role="listbox">
              <button
                type="button"
                role="option"
                aria-selected={selectedType === null}
                className={styles.option}
                onClick={() => handleSelect(null)}
              >
                {ALL_TYPES_LABEL}
              </button>
              {availableTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  role="option"
                  aria-selected={selectedType === type}
                  className={styles.option}
                  onClick={() => handleSelect(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-10 mt-2">
        {filteredEntries.map((entry) => (
          <GalleryCard key={entry.slug} entry={entry} />
        ))}
      </div>
    </>
  );
}
