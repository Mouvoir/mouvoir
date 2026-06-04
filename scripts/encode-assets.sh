#!/usr/bin/env bash
# Encode the doc/ source cutouts into the public/ asset convention:
#   <dest>/<base>.mov  — HEVC + alpha (videotoolbox), Safari-first
#   <dest>/<base>.webm — VP9 + alpha (alpha_mode=1), everyone else
#   <dest>/<base>.png  — rgba still (poster + <img> fallback)
# All sources are qtrle/argb with real transparency (see ALPHA_REPORT.md).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

encode() {
  local src="$1" dest="$2" base="$3"
  mkdir -p "$dest"
  echo "→ $base"
  # mov: HEVC with alpha, video stream only (drop source timecode track)
  ffmpeg -y -loglevel error -i "$src" -map 0:v:0 \
    -c:v hevc_videotoolbox -alpha_quality 0.9 -q:v 55 -tag:v hvc1 \
    "$dest/$base.mov"
  # webm: VP9 with alpha
  ffmpeg -y -loglevel error -i "$src" -map 0:v:0 -an \
    -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 32 -row-mt 1 \
    "$dest/$base.webm"
  # poster: rgba still at 0.3s (past any fade-in)
  ffmpeg -y -loglevel error -ss 0.3 -i "$src" -frames:v 1 -vf format=rgba \
    "$dest/$base.png"
}

# Opaque hero/tutorial footage (no alpha): downscale to 1280px-wide for web,
# drop alpha, keep the source's baked-in border. Same mov→webm→png triple as
# `encode`, but yuv420p instead of yuva420p so nothing is keyed to black.
encode_opaque() {
  local src="$1" dest="$2" base="$3"
  mkdir -p "$dest"
  echo "→ $base (opaque)"
  # mov: HEVC, no alpha, video stream only (drop source timecode track)
  ffmpeg -y -loglevel error -i "$src" -map 0:v:0 -an \
    -vf "scale=1280:-2,format=yuv420p" \
    -c:v hevc_videotoolbox -q:v 55 -tag:v hvc1 \
    "$dest/$base.mov"
  # webm: VP9, no alpha
  ffmpeg -y -loglevel error -i "$src" -map 0:v:0 -an \
    -vf "scale=1280:-2,format=yuv420p" \
    -c:v libvpx-vp9 -b:v 0 -crf 32 -row-mt 1 \
    "$dest/$base.webm"
  # poster: rgb still at 0.3s (past any fade-in)
  ffmpeg -y -loglevel error -ss 0.3 -i "$src" -frames:v 1 -vf "scale=1280:-2" \
    "$dest/$base.png"
}

F=doc/fairy_hand
P=doc/phone_move

# --- shared neon clips (flat, top-level) ---
encode "$F/WHISPER_THERMAL.mov"          public/whisper_thermal        whisper_thermal
encode "$F/STEP_BY_STEP_thermal.mov"     public/step_by_step_thermal   step_by_step_thermal
encode "$F/TOOL_KIT_ROSE_THERMAL.mov"    public/tool_kit_rose_thermal  tool_kit_rose_thermal
encode "$F/KEEP_MOVING.mov"              public/keep_moving            keep_moving
encode "$P/SITE_ONGLET/FOLLOW_THE_BEATS.mov" public/follow_the_beats   follow_the_beats

# --- fairy_hands secondaries (nested under the template) ---
encode "$F/FAIRY_HANDS_camerainfos.mov"     public/fairy_hands/fairy_hands_camerainfos     fairy_hands_camerainfos
encode "$F/FAIRY_HANDS_controllerinfos.mov" public/fairy_hands/fairy_hands_controllerinfos fairy_hands_controllerinfos
encode "$F/FAIRY_HANDS_glitterinfos.mov"    public/fairy_hands/fairy_hands_glitterinfos    fairy_hands_glitterinfos
encode "$F/FAIRY_HANDS_lightinfos.mov"      public/fairy_hands/fairy_hands_lightinfos      fairy_hands_lightinfos
encode "$F/FAIRY_HANDS_whisperinfos.mov"    public/fairy_hands/fairy_hands_whisperinfos    fairy_hands_whisperinfos
encode "$F/PRES_FAIRY_HANDS.mov"            public/fairy_hands/pres_fairy_hands            pres_fairy_hands
# central tutorial scene — opaque footage with baked-in pink border + caption
encode_opaque "$F/FAIRY_HANDS.mov"          public/fairy_hands/fairy_hands_tuto           fairy_hands_tuto

# --- phone_move secondaries (nested under the template) ---
encode "$P/PHONE_MOVE_app.mov"          public/phone_move/phone_move_app          phone_move_app
encode "$P/PHONE_MOVE_appinfos.mov"     public/phone_move/phone_move_appinfos     phone_move_appinfos
encode "$P/PHONE_MOVE_phone.mov"        public/phone_move/phone_move_phone        phone_move_phone
encode "$P/PHONE_MOVE_phoneinfo.mov"    public/phone_move/phone_move_phoneinfo    phone_move_phoneinfo
encode "$P/PHONE_MOVE_pres.mov"         public/phone_move/phone_move_pres         phone_move_pres
encode "$P/PHONE_MOVE_TOUCH.mov"        public/phone_move/phone_move_touch        phone_move_touch
encode "$P/PHONE_MOVE_whisperinfos.mov" public/phone_move/phone_move_whisperinfos phone_move_whisperinfos
# central tutorial scene — opaque footage with baked-in red border + caption
encode_opaque "$P/TUTO_PHONE_MOVE.mov"  public/phone_move/phone_move_tuto         phone_move_tuto

# --- OBJET_A_WIGGLE: already PNGs, just place them ---
mkdir -p public/fairy_hands/objet_a_wiggle
for n in 010 020 030 040 050; do
  cp "$F/OBJET_A_WIGGLE_$n.png" "public/fairy_hands/objet_a_wiggle/objet_a_wiggle_$n.png"
done
echo "→ objet_a_wiggle (5 png copied)"

echo "DONE"
