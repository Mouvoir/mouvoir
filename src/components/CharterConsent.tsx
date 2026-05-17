"use client";

import { useEffect, useSyncExternalStore } from "react";

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

type CardSlot = {
  colors: readonly [string, string, string];
  rotate: number;
  zIndex: number;
  left: number;
};

// Deck slots fan out from -14° to +14°. The z-index sequence is intentionally
// non-monotonic so neighbouring cards don't form a left-to-right pile (per
// the design's "shuffled deck" intent).
const DECK: readonly CardSlot[] = [
  { colors: ["#fce4f5", "#ffd6ef", "#ffbfe8"], rotate: -14, zIndex: 3, left: 50 },
  { colors: ["#9af0f2", "#7aeef0", "#5de3e5"], rotate: -7, zIndex: 5, left: 215 },
  { colors: ["#7AE87F", "#5de87a", "#45d462"], rotate: 0, zIndex: 1, left: 375 },
  { colors: ["#F5F07A", "#f5e94a", "#edd630"], rotate: 7, zIndex: 4, left: 535 },
  { colors: ["#FF7AE8", "#ff5ec4", "#f040b0"], rotate: 14, zIndex: 2, left: 700 },
] as const;

type CharterPoint = {
  title: string;
  body: string;
  sub1: { title: string; body: string };
  sub2: { title: string; body: string };
};

const POINTS: readonly CharterPoint[] = [
  {
    title: "PRÉVENTION DU PUBLIC",
    body:
      "L'objectif est de permettre une participation libre et consciente, pour que le public sache dans quelle type de soirée il se rend.",
    sub1: {
      title: "AVANT CHAQUE SESSION",
      body:
        "Il est nécessaire que le public soit averti de la présence de caméras.",
    },
    sub2: {
      title: "AVIS PUBLIC",
      body: "Un message clair doit être présent avant chaque début de session.",
    },
  },
  {
    title: "NO RECORD",
    body: "Partycule privilégie l'expérience du moment, non sa trace.",
    sub1: {
      title: "POURQUOI NO RECORD ?",
      body: "La captation nuit à la liberté d'expression sur la piste de danse.",
    },
    sub2: {
      title: "EXCEPTIONS",
      body: "Seuls les visuels scéniques approuvés peuvent être diffusés.",
    },
  },
  {
    title: "ANONYMAT DES DANSEURS",
    body:
      "La caméra capte une énergie collective, pas des identités individuelles.",
    sub1: {
      title: "COLLECTIF VS INDIVIDUEL",
      body: "L'énergie du groupe prime sur l'identité individuelle.",
    },
    sub2: {
      title: "PROTECTION",
      body: "Aucun visage ne peut être diffusé sans consentement explicite.",
    },
  },
  {
    title: "INCLUSION DES CORPS",
    body: "Un vecteur de mouvement, d'expression et de puissance collective.",
    sub1: {
      title: "REPRÉSENTATION",
      body:
        "Toutes les morphologies et expressions corporelles sont bienvenues.",
    },
    sub2: {
      title: "DIVERSITÉ",
      body: "Partycule valorise la pluralité des corps et des mouvements.",
    },
  },
  {
    title: "BIENVEILLANCE",
    body: "Savoir «lâcher l'image» fait partie intégrante de la pratique.",
    sub1: {
      title: "LÂCHER PRISE",
      body: "Le corps comme outil d'exploration et de liberté.",
    },
    sub2: {
      title: "PRATIQUE",
      body: "Intégrer la bienveillance dans chaque interaction sur le dancefloor.",
    },
  },
];

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
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: "var(--pink-bg)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="charter-consent-title"
    >
      <div className="flex flex-col items-center px-4 py-6 pb-10 min-h-screen">
        {/* Header card */}
        <div
          className="w-full text-white text-center"
          style={{
            background: "var(--pink-card)",
            borderRadius: "28px",
            maxWidth: "900px",
            padding: "44px 72px 40px",
          }}
        >
          <h1 className="text-[64px] font-normal leading-[1.05] m-0 mb-3">
            Partycule
          </h1>
          <h2
            id="charter-consent-title"
            className="text-[44px] font-bold leading-[1.05] m-0 mb-6"
          >
            CHARTE
          </h2>
          <p className="font-mono text-[13px] tracking-[0.06em] uppercase m-0">
            Charte à respecter avant de pouvoir accéder au site, et aux templates.
          </p>
        </div>

        {/* Charter deck — hover a card to fan its two sub-cards out from behind */}
        <div className="charter-deck-viewport">
          <div className="charter-deck">
            {POINTS.map((point, i) => {
              const slot = DECK[i];
              return (
                <div
                  key={i}
                  className="charter-deck__slot"
                  style={
                    {
                      left: `${slot.left}px`,
                      "--slot-z": slot.zIndex,
                      transform: `rotate(${slot.rotate}deg)`,
                    } as React.CSSProperties
                  }
                >
                  <div
                    className="charter-deck__sub charter-deck__sub--left"
                    style={{ background: slot.colors[1] }}
                  >
                    <div>
                      <div className="charter-deck__title">{point.sub1.title}</div>
                      <div className="charter-deck__body">{point.sub1.body}</div>
                    </div>
                  </div>
                  <div
                    className="charter-deck__sub charter-deck__sub--right"
                    style={{ background: slot.colors[2] }}
                  >
                    <div>
                      <div className="charter-deck__title">{point.sub2.title}</div>
                      <div className="charter-deck__body">{point.sub2.body}</div>
                    </div>
                  </div>
                  <div
                    className="charter-deck__main"
                    style={{ background: slot.colors[0] }}
                  >
                    <div>
                      <div className="charter-deck__title">
                        {i + 1}. {point.title}
                      </div>
                      <div className="charter-deck__body">{point.body}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Accept button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleAccept}
            className="btn-cta"
            style={{ width: "auto", minWidth: "260px" }}
          >
            J&apos;accepte et je continue
          </button>
        </div>
      </div>
    </div>
  );
}
