"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from "react";
import styles from "./controlledVideo.module.css";

// Looping clip with custom controls. Mirrors AssetVideo's path scheme
// (`/<srcBase>.{mov,webm,png}`, mov first for Safari's alpha path) but keeps a
// ref so a scrubber can drive `currentTime` and a button can request native
// fullscreen. Stays autoplay/muted/loop; the controls only fade in on hover.
// The accent colour is passed through as the `--accent` custom property so each
// host (template hero, choreography result) can theme it.

const SCRUB_STEPS = 1000;
const DEFAULT_ACCENT = "var(--color-pink-card)";

interface ControlledVideoProps {
  /** Path under public/ WITHOUT extension, e.g. "urbex/urbex". */
  srcBase: string;
  /** Spoken label (titles are baked into the footage). */
  label?: string;
  /** CSS colour for the scrubber/thumb/button hover. Defaults to the site pink. */
  accent?: string;
  /** Whether a `<srcBase>.png` first-frame still exists to use as poster. */
  poster?: boolean;
}

// Vendor-prefixed fullscreen members not in the lib DOM types (Safari).
type FullscreenDoc = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => void;
};
type FullscreenEl = HTMLElement & {
  webkitRequestFullscreen?: () => void;
};
type FullscreenVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
};

export function ControlledVideo({
  srcBase,
  label,
  accent = DEFAULT_ACCENT,
  poster = true,
}: ControlledVideoProps) {
  const movUrl = `/${srcBase}.mov`;
  const webmUrl = `/${srcBase}.webm`;
  const pngUrl = `/${srcBase}.png`;

  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Whether playback should resume after a scrub gesture ends.
  const resumeAfterScrub = useRef(false);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0..1
  const [fullscreen, setFullscreen] = useState(false);

  // Keep local state in sync with the element so external pauses / OS-driven
  // fullscreen exits are reflected in the controls.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTime = () => {
      if (video.duration > 0) setProgress(video.currentTime / video.duration);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  useEffect(() => {
    const doc = document as FullscreenDoc;
    const onChange = () =>
      setFullscreen(
        Boolean(doc.fullscreenElement ?? doc.webkitFullscreenElement),
      );
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  };

  const onScrub = (event: ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video || !(video.duration > 0)) return;
    const ratio = Number(event.target.value) / SCRUB_STEPS;
    video.currentTime = ratio * video.duration;
    setProgress(ratio);
  };

  // Pause while the user drags so the looping playback's `timeupdate` doesn't
  // fight the thumb; resume on release only if it was playing beforehand.
  const onScrubStart = () => {
    const video = videoRef.current;
    if (!video) return;
    resumeAfterScrub.current = !video.paused;
    video.pause();
  };
  const onScrubEnd = () => {
    if (resumeAfterScrub.current) void videoRef.current?.play();
    resumeAfterScrub.current = false;
  };

  const toggleFullscreen = () => {
    const doc = document as FullscreenDoc;
    if (doc.fullscreenElement ?? doc.webkitFullscreenElement) {
      (doc.exitFullscreen ?? doc.webkitExitFullscreen)?.call(doc);
      return;
    }
    const root = rootRef.current as FullscreenEl | null;
    if (root?.requestFullscreen) void root.requestFullscreen();
    else if (root?.webkitRequestFullscreen) root.webkitRequestFullscreen();
    // iOS Safari only allows fullscreen on the <video> itself.
    else (videoRef.current as FullscreenVideo | null)?.webkitEnterFullscreen?.();
  };

  const rootStyle = { "--accent": accent } as CSSProperties;
  const fillStyle = { "--fill": `${progress * 100}%` } as CSSProperties;

  return (
    <div className={styles.root} ref={rootRef} style={rootStyle}>
      <video
        ref={videoRef}
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster ? pngUrl : undefined}
        aria-label={label}
      >
        {/* HEVC-with-alpha mov first for Safari, VP9 webm for the rest. */}
        <source src={movUrl} type="video/quicktime" />
        <source src={webmUrl} type="video/webm" />
      </video>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Lecture"}
        >
          {playing ? "❚❚" : "▶"}
        </button>
        <input
          type="range"
          className={styles.scrubber}
          style={fillStyle}
          min={0}
          max={SCRUB_STEPS}
          value={Math.round(progress * SCRUB_STEPS)}
          onChange={onScrub}
          onPointerDown={onScrubStart}
          onPointerUp={onScrubEnd}
          onKeyDown={onScrubStart}
          onKeyUp={onScrubEnd}
          aria-label="Progression de la vidéo"
        />
        <button
          type="button"
          className={styles.iconBtn}
          onClick={toggleFullscreen}
          aria-label={fullscreen ? "Quitter le plein écran" : "Plein écran"}
        >
          {fullscreen ? "✕" : "⛶"}
        </button>
      </div>
    </div>
  );
}
