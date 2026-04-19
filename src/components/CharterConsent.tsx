"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

const STORAGE_KEY = "partycule-charter-accepted";
const CHANGE_EVENT = "partycule:charter-consent-changed";

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
  const t = useTranslations("CharterConsent");
  const tCharter = useTranslations("Charter");

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
      className="fixed inset-0 z-50 flex items-center justify-center p-8"
      style={{
        background: "rgba(26, 26, 26, 0.55)",
        backdropFilter: "blur(4px)",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="charter-consent-title"
    >
      <div
        className="w-full text-white"
        style={{
          background: "var(--pink-card)",
          borderRadius: "30px",
          maxWidth: "1100px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "72px 88px 80px",
        }}
      >
        <h1 className="text-[64px] font-normal text-center tracking-[-0.01em] leading-[1.05] m-0 mb-5">
          {tCharter("brand")}
        </h1>
        <h2
          id="charter-consent-title"
          className="text-[44px] font-normal text-center tracking-[0.01em] leading-[1.05] m-0 mb-7"
        >
          {tCharter("title")}
        </h2>
        <p className="font-mono text-[15px] tracking-[0.04em] uppercase text-center mb-10 m-0">
          {tCharter("preamble")}
        </p>

        <p className="text-[19px] leading-[1.5] mb-12 m-0">
          {tCharter("body")}
        </p>

        <h3 className="font-mono text-[17px] tracking-[0.04em] uppercase mb-4 m-0">
          {tCharter("sectionPresentation")}
        </h3>
        <p className="text-[16px] leading-[1.55] mb-4 m-0">
          {tCharter("presentationWelcome")}
        </p>
        <p className="text-[16px] leading-[1.55] mb-4 m-0">
          {tCharter("presentationBody")}
        </p>
        <p className="text-[16px] leading-[1.55] mb-12 m-0">
          {tCharter("presentationInstructionsLineOne")}
          <br />
          {tCharter("presentationInstructionsLineTwo")}
        </p>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleAccept}
            className="btn-cta"
            style={{ width: "auto", minWidth: "260px" }}
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
