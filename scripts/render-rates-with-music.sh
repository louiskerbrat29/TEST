#!/usr/bin/env bash
# Renders the RatesVideo composition and adds an original, royalty-free
# synthesized background track (Am - F - C - G progression with a light
# rhythmic pulse for a more energetic, "sales" feel), then muxes it in.
set -euo pipefail

cd "$(dirname "$0")/.."

VIDEO_RAW="out/kerjean-taux-immobilier.mp4"
VIDEO_FINAL="out/kerjean-taux-immobilier-musique.mp4"
AUDIO_DIR="$(mktemp -d)"
DURATION=48
CHORD_LEN=12.75

mkdir -p out

npx remotion render src/index.ts RatesVideo "$VIDEO_RAW"

gen_chord () {
	local f1=$1 f2=$2 f3=$3 out=$4
	ffmpeg -y -f lavfi -i "sine=frequency=${f1}:duration=${CHORD_LEN}" \
		-f lavfi -i "sine=frequency=${f2}:duration=${CHORD_LEN}" \
		-f lavfi -i "sine=frequency=${f3}:duration=${CHORD_LEN}" \
		-filter_complex "[0:a][1:a][2:a]amix=inputs=3:duration=longest:weights=1 0.8 0.7,volume=0.5,afade=t=in:d=1,afade=t=out:st=$(awk "BEGIN{print ${CHORD_LEN}-1.2}"):d=1.2,lowpass=f=2000,tremolo=f=3.5:d=0.35" \
		-ac 2 "$out"
}

# vi - IV - I - V progression, energetic pulse for a sales-oriented reel
gen_chord 220.00 261.63 329.63 "$AUDIO_DIR/chord1.wav" # A minor
gen_chord 174.61 220.00 261.63 "$AUDIO_DIR/chord2.wav" # F major
gen_chord 261.63 329.63 392.00 "$AUDIO_DIR/chord3.wav" # C major
gen_chord 196.00 246.94 293.66 "$AUDIO_DIR/chord4.wav" # G major

ffmpeg -y -i "$AUDIO_DIR/chord1.wav" -i "$AUDIO_DIR/chord2.wav" -filter_complex "acrossfade=d=1" "$AUDIO_DIR/step1.wav"
ffmpeg -y -i "$AUDIO_DIR/step1.wav" -i "$AUDIO_DIR/chord3.wav" -filter_complex "acrossfade=d=1" "$AUDIO_DIR/step2.wav"
ffmpeg -y -i "$AUDIO_DIR/step2.wav" -i "$AUDIO_DIR/chord4.wav" -filter_complex "acrossfade=d=1" "$AUDIO_DIR/step3.wav"

ffmpeg -y -i "$AUDIO_DIR/step3.wav" -filter_complex "aecho=0.8:0.6:50:0.2,volume=0.9" "$AUDIO_DIR/pad_full.wav"
ffmpeg -y -i "$AUDIO_DIR/pad_full.wav" -t "$DURATION" -af "afade=t=out:st=$((DURATION - 2)):d=2,volume=0.85" "$AUDIO_DIR/music.wav"
ffmpeg -y -i "$AUDIO_DIR/music.wav" -af "loudnorm=I=-16:TP=-1.5:LRA=11" "$AUDIO_DIR/music_norm.wav"

ffmpeg -y -i "$VIDEO_RAW" -i "$AUDIO_DIR/music_norm.wav" \
	-c:v copy -c:a aac -b:a 192k -shortest \
	"$VIDEO_FINAL"

rm -rf "$AUDIO_DIR"
echo "Done: $VIDEO_FINAL"
