#!/usr/bin/env bash
# One-off encoder: turns the raw alpha QuickTime masters delivered for the
# movement-rehearsal page into the web triple every consumer expects
# (`/<folder>/<folder>.{mov,webm,png}`), following public/ asset conventions.
#
#  - .mov : HEVC (hvc1) with alpha   -> Safari/WebKit path, served first
#  - .webm: VP9 with alpha (yuva420p) -> every other browser
#  - .png : first frame, rgba         -> <video poster> + final fallback
#
# Alpha is always preserved, never flattened on black: stickers overlap on the
# page, so an opaque box would punch a black hole over the sticker beneath it.
#
# Usage: scripts/encode_movement_rehearsal.sh
set -euo pipefail

SRC_DIR="docs/swisstransfer_d071cd4f-fa48-4768-b68b-484caca839a5"
PUB="public"

# source-basename(without .mov) -> snake_case folder/base name
# Names are reconciled from the EXPLICATION PDF annotations into ASCII snake_case.
map() {
  case "$1" in
    "CORE")                    echo "core" ;;
    "CTRL+F")                  echo "ctrl_f" ;;
    "ON_THE_FLOOR_OF_RIO")     echo "on_the_floor_of_rio" ;;
    "PARTY_PARTY")             echo "party_party" ;;
    "PARTY_PARTY_TITRE")       echo "party_party_titre" ;;
    "VIDEO_CORE_01B")          echo "video_core_01b" ;;
    "VIDEO_CORE_02B")          echo "video_core_02b" ;;
    "VIDEO_CORE_03B")          echo "video_core_03b" ;;
    "VIDEO_CORE_04B")          echo "video_core_04b" ;;
    "VIZBIZ_infos")            echo "vizbiz_infos" ;;
    "BABYBLAZER_infos")        echo "babyblazer_infos" ;;
    "MADAMIPSUM_infos")        echo "madamipsum_infos" ;;
    "ANTOINE_infos")           echo "antoine_infos" ;;
    "BEATROOT_01")             echo "beatroot_01" ;;
    "BEATROOT_02")             echo "beatroot_02" ;;
    "BEATROOT_01_infos")       echo "beatroot_01_infos" ;;
    "BEATROOT_02_infos")       echo "beatroot_02_infos" ;;
    "PARTY_BR")                echo "party_br" ;;
    "VS_PARTY_EUR")            echo "vs_party_eur" ;;
    "VS_PARTY_EUR_infos")      echo "vs_party_eur_infos" ;;
    "VIDEO_RIO_01_infos")      echo "video_rio_01_infos" ;;
    "INSOLATION_VISUELLE02")   echo "insolation_visuelle" ;;
    "INSOLATION_VISUELLE_infos") echo "insolation_visuelle_infos" ;;
    "CRTL+F_VIDEO")            echo "crtl_f_video" ;;
    "CRTL+F_JAM")              echo "crtl_f_jam" ;;
    "CRTL+F_JAM02")            echo "crtl_f_jam02" ;;
    "CRTL+F_infos")            echo "crtl_f_infos" ;;
    "CRTL+F_JAM_infos02")      echo "crtl_f_jam_infos02" ;;
    "FINTA_TITRE")             echo "finta_titre" ;;
    "FINTA_infos")             echo "finta_infos" ;;
    *)                         echo "" ;;
  esac
}

encode() {
  local src="$1" name="$2"
  local dir="$PUB/$name"
  mkdir -p "$dir"
  echo ">> $name"
  # .webm — VP9 with alpha
  ffmpeg -hide_banner -loglevel error -y -i "$src" -an \
    -c:v libvpx-vp9 -pix_fmt yuva420p -auto-alt-ref 0 -b:v 0 -crf 34 \
    "$dir/$name.webm"
  # .mov — HEVC (hvc1) with alpha via VideoToolbox
  ffmpeg -hide_banner -loglevel error -y -i "$src" -an \
    -c:v hevc_videotoolbox -alpha_quality 0.85 -q:v 55 -tag:v hvc1 -pix_fmt bgra \
    "$dir/$name.mov"
  # .png — first frame, rgba
  ffmpeg -hide_banner -loglevel error -y -i "$src" -frames:v 1 "$dir/$name.png"
}

for src in "$SRC_DIR"/*.mov; do
  base="$(basename "$src" .mov)"
  name="$(map "$base")"
  if [ -z "$name" ]; then
    echo "-- skip (unmapped): $base"
    continue
  fi
  encode "$src" "$name"
done

echo "DONE."
