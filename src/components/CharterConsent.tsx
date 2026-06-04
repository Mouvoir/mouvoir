"use client";

import {useEffect, useState, useSyncExternalStore} from "react";
import {CharterGrid} from "./CharterGrid";
import styles from "./CharterConsent.module.css";

const STORAGE_KEY = "Mouvoir-charter-accepted";
const CHANGE_EVENT = "Mouvoir:charter-consent-changed";

function subscribe(listener: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, listener);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, listener);
  };
}

function getClientSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY);
}

// Assume accepted during SSR so returning visitors don't see a modal flash
// on hydration; first-time visitors briefly see the page before the modal
// mounts, which matches typical cookie-banner behaviour.
function getServerSnapshot() {
  return "true";
}
export function CharterConsent() {
  const stored = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const visible = stored !== "true";
  // When set, the grid collapses and that rule's detailed sticker layout shows.
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible]);

  // Escape closes the expanded rule back to the grid.
  useEffect(() => {
    if (expanded === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  if (!visible) return null;

  const handleAccept = () => {
    window.localStorage.setItem(STORAGE_KEY, "true");
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  return (
    <div
      className={styles.modal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="charter-consent-title"
    >
      <CharterGrid
        expanded={expanded}
        onSelect={setExpanded}
        onAccept={handleAccept}
        onBack={() => setExpanded(null)}
      />
    </div>
  );
}
