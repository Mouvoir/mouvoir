"use client";

import { useEffect, useRef, useState } from "react";
import { CHORE_FILTERS, FILTER_TRIGGER } from "./choreFilters";
import styles from "./choreFilterDropdown.module.css";

interface ChoreFilterDropdownProps {
  /** Active template filter slug, or null for "all". */
  selected: string | null;
  /** Called with a template slug, or null to reset to "all". */
  onSelect: (slug: string | null) => void;
}

const RESET_LABEL = "All";

export function ChoreFilterDropdown({ selected, onSelect }: ChoreFilterDropdownProps) {
  const { folder, left, top, width } = FILTER_TRIGGER;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const base = `${folder}/${folder}`;
  const activeFilter = CHORE_FILTERS.find((f) => f.slug === selected) ?? null;

  // Close on outside click or Escape while the panel is open.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const choose = (slug: string | null) => {
    onSelect(slug);
    setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className={styles.root}
      style={{ left: `${left}%`, top: `${top}%`, width: `${width}%` }}
    >
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={
          activeFilter
            ? `Filter by template — active: ${activeFilter.title}`
            : "Filter choreographies by template"
        }
        onClick={() => setOpen((value) => !value)}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={`/${base}.png`}
          className={styles.triggerMedia}
        >
          {/* mov first for Safari (HEVC alpha), webm (VP9) for the rest. */}
          <source src={`/${base}.mov`} type="video/quicktime" />
          <source src={`/${base}.webm`} type="video/webm" />
        </video>
      </button>

      {activeFilter && <p className={styles.activeLabel}>{activeFilter.title}</p>}

      {open && (
        <ul className={styles.panel} role="listbox" aria-label="Templates">
          <li role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={selected === null}
              className={`${styles.option} ${styles.optionReset} ${
                selected === null ? styles.optionSelected : ""
              }`}
              onClick={() => choose(null)}
            >
              {RESET_LABEL}
            </button>
          </li>
          {CHORE_FILTERS.map((filter) => (
            <li key={filter.slug} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={selected === filter.slug}
                className={`${styles.option} ${
                  selected === filter.slug ? styles.optionSelected : ""
                }`}
                onClick={() => choose(filter.slug)}
              >
                {filter.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
