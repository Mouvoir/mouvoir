"use client";

import {
  Children,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, useReducedMotion } from "framer-motion";

const TRANSITION_MS = 800;
const WHEEL_THRESHOLD = 12;
const TOUCH_THRESHOLD = 60;

type Props = {
  children: ReactNode;
  initialIndex?: number;
  onChange?: (index: number) => void;
  showDots?: boolean;
  dotColor?: string;
  dotActiveColor?: string;
  ariaLabels?: string[];
};

export function FullPageScroll({
  children,
  initialIndex = 0,
  onChange,
  showDots = true,
  dotColor = "rgba(0,0,0,0.25)",
  dotActiveColor = "var(--ink, #1a1a1a)",
  ariaLabels,
}: Props) {
  const sections = useMemo(
    () => Children.toArray(children).filter(Boolean),
    [children],
  );
  const total = sections.length;
  const [index, setIndex] = useState(() =>
    Math.min(Math.max(initialIndex, 0), Math.max(total - 1, 0)),
  );
  const lockedUntilRef = useRef(0);
  const touchStartRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.min(Math.max(next, 0), total - 1);
      const now = performance.now();
      if (clamped === index) return;
      if (now < lockedUntilRef.current) return;
      lockedUntilRef.current = now + TRANSITION_MS;
      setIndex(clamped);
    },
    [index, total],
  );

  useEffect(() => {
    onChange?.(index);
  }, [index, onChange]);

  // Lock body scroll while mounted; restore on unmount
  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

  // Wheel
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
      e.preventDefault();
      if (e.deltaY > 0) goTo(index + 1);
      else goTo(index - 1);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goTo, index]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        goTo(index + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goTo(index - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(total - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, index, total]);

  // Touch
  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0]?.clientY ?? null;
    };
    const onEnd = (e: TouchEvent) => {
      if (touchStartRef.current === null) return;
      const endY = e.changedTouches[0]?.clientY ?? touchStartRef.current;
      const delta = touchStartRef.current - endY;
      touchStartRef.current = null;
      if (Math.abs(delta) < TOUCH_THRESHOLD) return;
      if (delta > 0) goTo(index + 1);
      else goTo(index - 1);
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [goTo, index]);

  return (
    <div className="fullpage-root">
      <motion.div
        className="fullpage-track"
        animate={{ y: `-${index * 100}vh` }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                type: "tween",
                ease: [0.76, 0, 0.24, 1],
                duration: TRANSITION_MS / 1000,
              }
        }
      >
        {sections.map((child, i) => (
          <div className="fullpage-section" key={i} aria-hidden={i !== index}>
            {child}
          </div>
        ))}
      </motion.div>

      {showDots && total > 1 && (
        <nav className="fullpage-dots" aria-label="Page sections">
          {sections.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`fullpage-dot${i === index ? " is-active" : ""}`}
              aria-label={ariaLabels?.[i] ?? `Section ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => goTo(i)}
              style={{
                ["--dot-color" as string]: dotColor,
                ["--dot-active" as string]: dotActiveColor,
              }}
            />
          ))}
        </nav>
      )}
    </div>
  );
}
