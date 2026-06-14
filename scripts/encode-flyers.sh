#!/usr/bin/env bash
# One-off: normalize the flyers-links source .mov exports (qtrle/argb) into the
# public/<folder>/<folder>.{mov,webm,png} alpha-preserving triple used by the
# sticker collage. See .claude/rules/asset-conventions.md and the
# choreography-video-alpha memory for the recipe. Safe to re-run (idempotent).
set -euo pipefail

SRC_DIR="docs/swisstransfer_0f7e83c8-78f7-4114-b9d9-c812dea34cc9"

# source-basename  ->  snake_case public folder/base name
declare -a VIDEOS=(
  "BODY_MOVES:body_moves"
  "GLITTER_MOVES:glitter_moves"
  "VJ_CREW:vj_crew"
  "PLUGIN:plugin"
  "YOUTUBE_01:youtube_01"
  "YOUTUBE_02:youtube_02"
  "YOUTUBE_03:youtube_03"
  "YOUTUBE_04:youtube_04"
  "YOUTUBE_05:youtube_05"
  "YOUTUBE_06:youtube_06"
  "YOUTUBE_07:youtube_07"
  "YOUTUBE_08:youtube_08"
  "YOUTUBE_09:youtube_09"
  "YOUTUBE_10:youtube_10"
  "LISE_PRES:lise_pres"
  "MATHILDE_PRES:mathilde_pres"
  "ROZETTA_PRES:rozetta_pres"
  "ELISALIEN_PRES:elisalien_pres"
)

encode_one() {
  local src="$1" folder="$2"
  local in="$SRC_DIR/${src}.mov"
  local out="public/${folder}/${folder}"
  mkdir -p "public/${folder}"
  echo ">>> ${src} -> ${folder}"
  # webm: VP9 with alpha (alt-ref MUST be off for alpha)
  ffmpeg -y -loglevel error -i "$in" -an \
    -c:v libvpx-vp9 -pix_fmt yuva420p -auto-alt-ref 0 -b:v 0 -crf 32 \
    "${out}.webm"
  # mov: HEVC with alpha for Safari (hvc1 tag + bgra input)
  ffmpeg -y -loglevel error -i "$in" -an -vf format=bgra \
    -c:v hevc_videotoolbox -allow_sw 1 -alpha_quality 0.9 -tag:v hvc1 -b:v 5M \
    "${out}.mov"
  # png poster: a late, fully-revealed frame, with alpha
  ffmpeg -y -loglevel error -sseof -0.4 -i "$in" -frames:v 1 -pix_fmt rgba \
    "${out}.png"
}

for pair in "${VIDEOS[@]}"; do
  encode_one "${pair%%:*}" "${pair##*:}"
done

# Static plugin PNGs (already alpha PNG, only copied into folder-per-unit shape)
declare -a PNGS=(
  "FREENECT0:freenect0"
  "MEDIAPIPE0:mediapipe0"
  "APPLI0:appli0"
)
for pair in "${PNGS[@]}"; do
  src="${pair%%:*}"; folder="${pair##*:}"
  mkdir -p "public/${folder}"
  cp "$SRC_DIR/${src}.png" "public/${folder}/${folder}.png"
  echo ">>> ${src}.png -> ${folder}/${folder}.png"
done

echo "ALL DONE"
