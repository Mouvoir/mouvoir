#!/usr/bin/env bash
# Encode doc/swisstransfer_* sources into public/ following project asset conventions:
#   <dest>/<base>.mov  — HEVC + alpha (videotoolbox), Safari-first
#   <dest>/<base>.webm — VP9 + alpha (alpha_mode=1), everyone else
#   <dest>/<base>.png  — rgba still (poster + <img> fallback)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

encode() {
  local src="$1" dest="$2" base="$3"
  mkdir -p "$dest"
  echo "→ $base"
  ffmpeg -y -loglevel error -i "$src" -map 0:v:0 \
    -c:v hevc_videotoolbox -alpha_quality 0.9 -q:v 55 -tag:v hvc1 \
    "$dest/$base.mov"
  ffmpeg -y -loglevel error -i "$src" -map 0:v:0 -an \
    -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 32 -row-mt 1 \
    "$dest/$base.webm"
  ffmpeg -y -loglevel error -ss 0.3 -i "$src" -frames:v 1 -vf format=rgba \
    "$dest/$base.png"
}

encode_opaque() {
  local src="$1" dest="$2" base="$3"
  mkdir -p "$dest"
  echo "→ $base (opaque)"
  ffmpeg -y -loglevel error -i "$src" -map 0:v:0 -an \
    -vf "scale=1280:-2,format=yuv420p" \
    -c:v hevc_videotoolbox -q:v 55 -tag:v hvc1 \
    "$dest/$base.mov"
  ffmpeg -y -loglevel error -i "$src" -map 0:v:0 -an \
    -vf "scale=1280:-2,format=yuv420p" \
    -c:v libvpx-vp9 -b:v 0 -crf 32 -row-mt 1 \
    "$dest/$base.webm"
  ffmpeg -y -loglevel error -ss 0.3 -i "$src" -frames:v 1 -vf "scale=1280:-2" \
    "$dest/$base.png"
}

# Source directories
S1=doc/swisstransfer_c75b479c-508f-4d81-958f-39fe634bed8d   # LIGHTING_YOU secondaries
S2=doc/swisstransfer_afeeaa03-5874-4b78-81b0-80c291b4751b   # DANCE_LENS secondaries
S3=doc/swisstransfer_82540642-e3de-4f02-a4a8-ed3ac22bb7c2   # PHONE_MOVE TD
S4=doc/swisstransfer_59a97f85-ae03-4abe-a913-4368d75f8999   # PHONE_MOVE VIDEO + GREYCLUB
S5=doc/swisstransfer_d2bcd759-a5a2-4868-aa1b-e02ef156f2fc   # PRES clips for existing templates
S6=doc/swisstransfer_8dae333e-dfea-4c40-a7c6-da2a95956ee5   # JINGLE_TITRE anims
S7=doc/swisstransfer_9a370cc4-ae74-4f6d-b27b-b1bd64baeb3e   # BRIGHTNESS + JAM_CTRLF_F + BACK_BLEU
S8=doc/swisstransfer_ca8b8f75-1eb4-4269-b100-1c87cc18aea2   # QUANTUMotion + FOLLOW_THE_BEATS_BLEU
S9=doc/swisstransfer_f3b1917f-9485-4471-9185-4219b7191610   # URBEX
S10=doc/swisstransfer_48062ba2-04b6-4b9d-bae5-00e4c02809c9  # STILL_IN_TRAINING_BLEU + MOUVOIR_BLEU03

# =============================================================================
# Section 1 — LIGHTING_YOU secondaries
# =============================================================================
encode "$S1/LIGHTING_YOU_camerainfos.mov"  public/lighting_you  lighting_you_camerainfos
encode "$S1/LIGHTING_YOU_flashinfos.mov"   public/lighting_you  lighting_you_flashinfos
encode "$S1/LIGHTING_YOU_makeupinfos.mov"  public/lighting_you  lighting_you_makeupinfos
encode "$S1/LIGHTING_YOU_tapeinfos.mov"    public/lighting_you  lighting_you_tapeinfos
encode "$S1/LIGHTING_YOU_whisperinfos.mov" public/lighting_you  lighting_you_whisperinfos
encode "$S1/LIGHTING_YOU_PRES.mov"         public/lighting_you  lighting_you_pres
mkdir -p public/lighting_you/objet
for n in 01 02 03 04 05; do
  cp "$S1/OBJET_$n.png" "public/lighting_you/objet/objet_$n.png"
done
echo "→ lighting_you/objet (5 png copied)"

# =============================================================================
# Section 2 — DANCE_LENS secondaries
# =============================================================================
encode "$S2/DANCE_LENS_camerainfo.mov"  public/dance_lens  dance_lens_camerainfo
encode "$S2/DANCE_LENS_plugininfo.mov"  public/dance_lens  dance_lens_plugininfo
encode "$S2/DANCE_LENS_whisperinfo.mov" public/dance_lens  dance_lens_whisperinfo
encode "$S2/DANCE_LENS_PRES.mov"        public/dance_lens  dance_lens_pres
encode "$S2/02WHISPER_THERMAL.mov"      public/whisper_thermal02  whisper_thermal02
mkdir -p public/dance_lens/objet
cp "$S2/OBJET_010.png" "public/dance_lens/objet/objet_010.png"
cp "$S2/OBJET_020.png" "public/dance_lens/objet/objet_020.png"
cp "$S2/OBJET_030.png" "public/dance_lens/objet/objet_030.png"
cp "$S2/OBJET_04.png"  "public/dance_lens/objet/objet_04.png"
cp "$S2/OBJET_05.png"  "public/dance_lens/objet/objet_05.png"
echo "→ dance_lens/objet (5 png copied)"

# =============================================================================
# Section 3 — PHONE_MOVE additions
# =============================================================================
encode         "$S3/PHONE_MOVE_TD.mov"    public/phone_move  phone_move_td
encode_opaque  "$S4/PHONE_MOVE_VIDEO.mov" public/phone_move  phone_move_video
mkdir -p public/phone_move/phone_move_jingle
cp "$S4/PHONE_MOVE_JINGLE_02000.png" "public/phone_move/phone_move_jingle/phone_move_jingle_02000.png"
cp "$S4/PHONE_MOVE_JINGLE_0300.png"  "public/phone_move/phone_move_jingle/phone_move_jingle_0300.png"
echo "→ phone_move/phone_move_jingle (2 png copied)"

# =============================================================================
# Section 4 — PRES clips for existing templates
# =============================================================================
encode "$S5/IT_HAS_TO_SHINE_PRES.mov"            public/it_has_to_shine                it_has_to_shine_pres
encode "$S5/LIGHTING_YOU_PRES.mov"               public/lighting_you                   lighting_you_pres2
encode "$S5/MIRROR_MIRROR_PRES.mov"              public/mirror_mirror                  mirror_mirror_pres
encode "$S5/MOTION_SKELETON_PRES.mov"            public/motion_skeleton                motion_skeleton_pres
encode "$S5/SHADE_&_SHAPE_PRES.mov"              public/shade_and_shape                shade_and_shape_pres
encode "$S5/TEMPLATE_BODY_CANVAS.mov"            public/body_canvas                    body_canvas_pres
encode "$S5/TEMPLATE_DANCE_LENS_PRES.mov"        public/dance_lens                     dance_lens_pres2
encode "$S5/TEMPLATE_PRES_FAIRY_HANDS.mov"       public/fairy_hands                    fairy_hands_pres2
encode "$S5/STILL_IN_TRAINING_THERMAL.mov"       public/still_in_training_thermal      still_in_training_thermal
encode "$S5/CHOOSE_YOUR_DANCEFLOOR_THERMAL.mov"  public/choose_your_dancefloor_thermal choose_your_dancefloor_thermal

# =============================================================================
# Section 5 — JINGLE_TITRE anims (stickers for new templates)
# =============================================================================
encode "$S6/BRIGHTNESS_JINGLE_TITRE.mov"   public/brightness     brightness_anim
encode "$S6/GREYCLUB_JINGLE_TITRE.mov"     public/greyclub       greyclub_anim
encode "$S6/JAM_CTRLF_F_JINGLE_TITRE.mov"  public/jam_ctrlf_f    jam_ctrlf_f_anim
encode "$S6/LIGHT_JINGLE_TITRE.mov"        public/light          light_anim
encode "$S6/ModulAura_JINGLE_TITRE.mov"    public/modul_aura     modul_aura_anim
encode "$S6/QUANTUMotion_JINGLE_TITRE.mov" public/quantu_motion  quantu_motion_anim
encode "$S6/TURFUZZ_JINGLE_TITRE.mov"      public/turfuzz        turfuzz_anim
encode "$S6/URBEX_JINGLE_TITRE.mov"        public/urbex          urbex_anim
encode "$S6/YOYO_JINGLE_TITRE.mov"         public/yoyo           yoyo_anim
cp "$S6/BRIGHTNESS_JINGLE_TITRE00.png"    public/brightness/brightness_jingle_titre00.png
cp "$S6/GREYCLUB_JINGLE_TITRE00.png"      public/greyclub/greyclub_jingle_titre00.png
cp "$S6/JAM_CTRLF_F_JINGLE_TITRE00.png"   public/jam_ctrlf_f/jam_ctrlf_f_jingle_titre00.png
cp "$S6/LIGHT_JINGLE_TITRE00.png"         public/light/light_jingle_titre00.png
cp "$S6/ModulAura_JINGLE_TITRE00.png"     public/modul_aura/modul_aura_jingle_titre00.png
cp "$S6/QUANTUMotion_JINGLE_TITRE00.png"  public/quantu_motion/quantu_motion_jingle_titre00.png
cp "$S6/TURFUZZ_JINGLE_TITRE00.png"       public/turfuzz/turfuzz_jingle_titre00.png
cp "$S6/URBEX_JINGLE_TITRE00.png"         public/urbex/urbex_jingle_titre00.png
cp "$S6/YOYO_JINGLE_TITRE00.png"          public/yoyo/yoyo_jingle_titre00.png
echo "→ jingle_titre poster PNGs (9 copied)"

# =============================================================================
# Section 6 — Main clips for new templates
# =============================================================================

# BRIGHTNESS
encode "$S7/BRIGHTNESS.mov"         public/brightness  brightness
encode "$S7/BRIGHTNESS_infos01.mov" public/brightness  brightness_infos01
encode "$S7/BRIGHTNESS_infos02.mov" public/brightness  brightness_infos02

# GREYCLUB
encode "$S4/GREYCLUB.mov"         public/greyclub  greyclub
encode "$S4/GREYCLUB_infos01.mov" public/greyclub  greyclub_infos01
encode "$S4/GREYCLUB_infos02.mov" public/greyclub  greyclub_infos02

# JAM_CTRLF_F
encode_opaque "$S7/JAM_CTRLF_FAIRY_HAND_VIDEO.mov" public/jam_ctrlf_f jam_ctrlf_f
cp "$S7/JAM_CTRLF_F_010.png" "public/jam_ctrlf_f/jam_ctrlf_f_010.png"
cp "$S7/JAM_CTRLF_F_020.png" "public/jam_ctrlf_f/jam_ctrlf_f_020.png"
cp "$S7/JAM_CTRLF_F_030.png" "public/jam_ctrlf_f/jam_ctrlf_f_030.png"
echo "→ jam_ctrlf_f (3 png copied)"

# QUANTUMotion
encode_opaque "$S8/QUANTUMotion_VIDEO.mov"    public/quantu_motion  quantu_motion
encode         "$S8/QUANTUMotion_TITRE.mov"   public/quantu_motion  quantu_motion_titre
encode         "$S8/QUANTUMotion_INFOS01.mov" public/quantu_motion  quantu_motion_infos01
encode         "$S8/QUANTUMotion_INFOS02.mov" public/quantu_motion  quantu_motion_infos02
cp "$S8/QUANTUMotion_JINGLE010.png"  "public/quantu_motion/quantu_motion_jingle010.png"
cp "$S8/QUANTUMotion_JINGLE020.png"  "public/quantu_motion/quantu_motion_jingle020.png"
cp "$S8/QUANTUMotion_JINGLE0300.png" "public/quantu_motion/quantu_motion_jingle0300.png"
echo "→ quantu_motion (3 png copied)"

# URBEX
encode_opaque "$S9/URBEX_VIDEO.mov"    public/urbex  urbex
encode         "$S9/URBEX_TITRE.mov"   public/urbex  urbex_titre
encode         "$S9/URBEX_INFOS01.mov" public/urbex  urbex_infos01
encode         "$S9/URBEX_INFOS02.mov" public/urbex  urbex_infos02
cp "$S9/URBEX_JINGLE_020.png" "public/urbex/urbex_jingle_020.png"
cp "$S9/URBEX_JINGLE_030.png" "public/urbex/urbex_jingle_030.png"
echo "→ urbex (2 png copied)"

# =============================================================================
# Section 7 — New shared top-level clips
# =============================================================================
encode "$S8/FOLLOW_THE_BEATS_BLEU.mov"   public/follow_the_beats_bleu   follow_the_beats_bleu
encode "$S10/STILL_IN_TRAINING_BLEU.mov" public/still_in_training_bleu  still_in_training_bleu
encode "$S10/MOUVOIR_BLEU03.mov"         public/mouvoir_bleu03           mouvoir_bleu03

# =============================================================================
# Section 8 — BACK_BLEU UI control
# =============================================================================
encode "$S7/BACK_BLEU.mov" public/back_bleu back_bleu

echo "DONE"
