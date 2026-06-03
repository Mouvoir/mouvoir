"use client";

import {useEffect, useSyncExternalStore, type CSSProperties} from "react";
import {AssetVideo} from "./AssetVideo";
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

  useEffect(() => {
    if (!visible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible]);

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
      {/* Row 1: rule 1, the mouvoir/accept stack, rule 2 */}
      <div className={styles.gridRow}>
        <div
          className={`${styles.cell} ${styles.wide}`}
          style={{"--rot": "-4deg", "--scale": "1.12"} as CSSProperties}
        >
          <AssetVideo folder="regle_01/regle_01" name="regle_01"/>
        </div>
        <div className={styles.stack}>
          <div className={`${styles.cell} ${styles.mouvoirCell}`}>
            <AssetVideo folder="mouvoir_bleu_orange" name="mouvoir_bleu_orange"/>
          </div>
          <button
            type="button"
            className={`${styles.cell} ${styles.accept} ${styles.acceptCell}`}
            onClick={handleAccept}
            aria-label="Accepter la charte"
          >
            <AssetVideo folder="accept" name="accept"/>
          </button>
        </div>
        <div
          className={`${styles.cell} ${styles.wide}`}
          style={{"--rot": "3.5deg", "--scale": "1.12"} as CSSProperties}
        >
          <AssetVideo folder="regle_05/regle_05" name="regle_05"/>
        </div>
      </div>

      {/* Row 2: rules 3, 4 & 5 */}
      <div className={styles.gridRow}>
        <div
          className={`${styles.cell} ${styles.wide}`}
          style={{"--rot": "-2.5deg", "--scale": "1.12"} as CSSProperties}
        >
          <AssetVideo folder="regle_02/regle_02" name="regle_02"/>
        </div>
        <div
          className={`${styles.cell} ${styles.wide}`}
          style={{"--rot": "2.5deg", "--scale": "1.12"} as CSSProperties}
        >
          <AssetVideo folder="regle_03/regle_03" name="regle_03"/>
        </div>
        <div
          className={`${styles.cell} ${styles.wide}`}
          style={{"--rot": "4deg", "--scale": "1.12"} as CSSProperties}
        >
          <AssetVideo folder="regle_04/regle_04" name="regle_04"/>
        </div>
      </div>
    </div>
  );
}
