#!/usr/bin/env bash
# Inspect the real alpha content of each source clip.
# qtrle/argb sources all carry an alpha *channel*, but some are fully opaque
# (alpha = 255 everywhere). Those gain nothing from an alpha encode.
# Prints: <min_alpha> <status> <file>  — status is OPAQUE when min alpha >= 250.
set -u

# Files flagged as masters get a cheap seek-sample (a few timestamps) instead of
# a full decode, because they are multi-GB all-intra clips.
MASTERS="FAIRY_HANDS.mov TUTO_PHONE_MOVE.mov"

is_master() {
  for m in $MASTERS; do [ "$(basename "$1")" = "$m" ] && return 0; done
  return 1
}

# Global minimum alpha over a full (small file) or sampled (master) scan.
min_alpha_full() {
  ffmpeg -hide_banner -nostats -an -i "$1" \
    -vf "fps=5,alphaextract,signalstats,metadata=print:key=lavfi.signalstats.YMIN" \
    -f null - 2>&1 | grep -oE 'YMIN=[0-9.]+' | cut -d= -f2 | sort -n | head -1
}

min_alpha_sampled() {
  local f="$1" dur ts mn=255 v
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f" | cut -d. -f1)
  [ -z "$dur" ] && dur=10
  for frac in 0.05 0.25 0.50 0.75 0.95; do
    ts=$(awk -v d="$dur" -v f="$frac" 'BEGIN{printf "%.2f", d*f}')
    v=$(ffmpeg -hide_banner -nostats -an -ss "$ts" -i "$f" -frames:v 1 \
      -vf "alphaextract,signalstats,metadata=print:key=lavfi.signalstats.YMIN" \
      -f null - 2>&1 | grep -oE 'YMIN=[0-9.]+' | cut -d= -f2 | head -1)
    [ -n "$v" ] && awk -v a="$v" -v b="$mn" 'BEGIN{exit !(a<b)}' && mn="$v"
  done
  echo "$mn"
}

for f in "$@"; do
  if is_master "$f"; then mn=$(min_alpha_sampled "$f"); else mn=$(min_alpha_full "$f"); fi
  [ -z "$mn" ] && mn="?"
  status="alpha"
  if [ "$mn" != "?" ]; then
    awk -v a="$mn" 'BEGIN{exit !(a>=250)}' && status="OPAQUE"
  fi
  printf '%-8s %-7s %s\n' "$mn" "$status" "$f"
done
