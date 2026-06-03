#!/usr/bin/env bash
# Re-encode lossless qtrle .mov masters into web-optimized, alpha-preserving assets.
#   - WebM  (VP9, yuva420p)        -> Chrome / Firefox  (transparent)
#   - MOV   (HEVC, alpha via bgra) -> Safari / iOS       (transparent)
# Native resolution, source fps. Masters are preserved in doc/public_backup
# and removed from public/ (replaced by the lightweight HEVC .mov).
#
# Usage: scripts/encode-web-videos.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PUBLIC="$ROOT/public"
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT

# Quality knobs
VP9_CRF=32          # lower = better quality / bigger
HEVC_Q=55           # 1-100, higher = better quality
HEVC_ALPHA_Q=0.75   # 0-1, alpha channel quality

log()  { printf '%s\n' "$*"; }
human() { du -h "$1" 2>/dev/null | cut -f1; }

total_before=0
total_after=0
count=0

# Only process qtrle masters (skip files already encoded as hevc/vp9)
while IFS= read -r src; do
  codec="$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 "$src")"
  [ "$codec" = "qtrle" ] || { log "skip (not qtrle): ${src#$PUBLIC/}"; continue; }

  dir="$(dirname "$src")"
  base="$(basename "${src%.mov}")"
  webm_out="$dir/$base.webm"
  mov_out="$dir/$base.mov"
  stage_webm="$STAGE/$base.webm"
  stage_mov="$STAGE/$base.mov"

  before_bytes=$(stat -f%z "$src")
  count=$((count + 1))
  log "[$count] ${src#$PUBLIC/}  ($(human "$src"))"

  # VP9 alpha (Chrome/Firefox). -nostdin so ffmpeg never eats the loop's stdin.
  ffmpeg -nostdin -hide_banner -loglevel error -y -i "$src" -an \
    -c:v libvpx-vp9 -pix_fmt yuva420p -crf "$VP9_CRF" -b:v 0 -row-mt 1 \
    "$stage_webm"

  # HEVC alpha (Safari/iOS)
  ffmpeg -nostdin -hide_banner -loglevel error -y -i "$src" -an \
    -c:v hevc_videotoolbox -alpha_quality "$HEVC_ALPHA_Q" -q:v "$HEVC_Q" \
    -pix_fmt bgra -tag:v hvc1 \
    "$stage_mov"

  # Verify HEVC alpha survived: decode one frame and confirm it is rgba.
  probe_png="$STAGE/$base.probe.png"
  ffmpeg -nostdin -hide_banner -loglevel error -y -i "$stage_mov" \
    -frames:v 1 "$probe_png" </dev/null
  pix="$(ffprobe -v error -select_streams v:0 -show_entries stream=pix_fmt \
    -of csv=p=0 "$probe_png" 2>/dev/null || true)"
  rm -f "$probe_png"
  if [ "$pix" != "rgba" ]; then
    log "  !! WARNING: HEVC output not rgba (got '$pix') — leaving master in place"
    continue
  fi

  # Promote staged files into public/ (HEVC .mov replaces the qtrle master)
  mv "$stage_webm" "$webm_out"
  mv "$stage_mov"  "$mov_out"

  after_bytes=$(( $(stat -f%z "$webm_out") + $(stat -f%z "$mov_out") ))
  total_before=$((total_before + before_bytes))
  total_after=$((total_after + after_bytes))
  log "  -> webm $(human "$webm_out")  +  mov $(human "$mov_out")"
done < <(find "$PUBLIC" -type f -name '*.mov' | sort)

log ""
log "Done. $count master(s) re-encoded."
log "Before (masters): $(echo "scale=1; $total_before/1048576" | bc) MB"
log "After  (web):     $(echo "scale=1; $total_after/1048576" | bc) MB"
