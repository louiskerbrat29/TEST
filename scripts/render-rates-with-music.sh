#!/usr/bin/env bash
# Renders the RatesVideo composition and adds an original, royalty-free
# "summer / feel-good" track (no sampled or copyrighted material), built
# from three layers:
#   1. a looping C - G - Am - F progression at 112 BPM: syncopated marimba-
#      style plucks, soft four-on-the-floor kick, offbeat shaker, warm pad
#   2. a bright stab placed at the exact timecode of every text/info
#      appearance, so the music follows what shows up on screen
set -euo pipefail

cd "$(dirname "$0")/.."

VIDEO_RAW="out/kerjean-taux-immobilier.mp4"
VIDEO_FINAL="out/kerjean-taux-immobilier-musique.mp4"
AUDIO_DIR="$(mktemp -d)"

TOTAL_FRAMES=2230
FPS=30
DURATION=$(awk "BEGIN{print ${TOTAL_FRAMES}/${FPS}}")

BPM=112
BEAT=$(awk "BEGIN{print 60/${BPM}}")
EIGHTH=$(awk "BEGIN{print 60/${BPM}/2}")
BAR=$(awk "BEGIN{print 60/${BPM}*4}")
PROG_LEN=$(awk "BEGIN{print 60/${BPM}*16}")

mkdir -p out

npx remotion render src/index.ts RatesVideo "$VIDEO_RAW"

gen_silence () {
	ffmpeg -y -f lavfi -i "anullsrc=r=44100:cl=stereo" -t "$1" "$2"
}

# marimba-ish pluck: instant attack, exponential decay
gen_note () {
	local freq=$1 out=$2
	ffmpeg -y -f lavfi -i "sine=frequency=${freq}:duration=${EIGHTH}" \
		-af "afade=t=in:d=0.005,afade=t=out:st=0.025:d=$(awk "BEGIN{print ${EIGHTH}-0.025}"):curve=exp,volume=0.5" \
		-ac 2 -ar 44100 "$out"
}

gen_kick () {
	ffmpeg -y -f lavfi -i "sine=frequency=90:duration=0.15" \
		-af "afade=t=in:d=0.003,afade=t=out:st=0.02:d=0.13:curve=exp,volume=0.85" \
		-ac 2 -ar 44100 "$1"
}

gen_shaker () {
	ffmpeg -y -f lavfi -i "anoisesrc=d=0.06:c=white:r=44100" \
		-af "highpass=f=6000,afade=t=out:st=0.005:d=0.055,volume=0.5" \
		-ac 2 -ar 44100 "$1"
}

# one bar of a chord: plucks + kick + shaker + pad
build_bar () {
	local n1=$1 n2=$2 n3=$3 n4=$4 p1=$5 p2=$6 p3=$7 dir=$8
	mkdir -p "$dir"

	gen_note "$n1" "$dir/n0.wav"
	gen_note "$n2" "$dir/n1.wav"
	gen_note "$n3" "$dir/n2.wav"
	gen_note "$n4" "$dir/n3.wav"
	gen_silence "$EIGHTH" "$dir/rest.wav"

	# syncopated 8th pattern with two rests for a bouncy summer feel
	{
		echo "file 'n0.wav'"; echo "file 'n2.wav'"; echo "file 'rest.wav'"; echo "file 'n3.wav'"
		echo "file 'n1.wav'"; echo "file 'n2.wav'"; echo "file 'rest.wav'"; echo "file 'n3.wav'"
	} > "$dir/arp.txt"
	ffmpeg -y -f concat -safe 0 -i "$dir/arp.txt" -c copy "$dir/arp.wav"

	gen_kick "$dir/kick.wav"
	gen_silence "$(awk "BEGIN{print ${BEAT}-0.15}")" "$dir/kicksil.wav"
	{
		for _ in 1 2 3 4; do echo "file 'kick.wav'"; echo "file 'kicksil.wav'"; done
	} > "$dir/kicks.txt"
	ffmpeg -y -f concat -safe 0 -i "$dir/kicks.txt" -c copy "$dir/kicks.wav"

	gen_shaker "$dir/shaker.wav"
	gen_silence "$EIGHTH" "$dir/shsil1.wav"
	gen_silence "$(awk "BEGIN{print ${EIGHTH}-0.06}")" "$dir/shsil2.wav"
	{
		for _ in 1 2 3 4; do
			echo "file 'shsil1.wav'"; echo "file 'shaker.wav'"; echo "file 'shsil2.wav'"
		done
	} > "$dir/shakers.txt"
	ffmpeg -y -f concat -safe 0 -i "$dir/shakers.txt" -c copy "$dir/shakers.wav"

	ffmpeg -y -f lavfi -i "sine=frequency=${p1}:duration=${BAR}" \
		-f lavfi -i "sine=frequency=${p2}:duration=${BAR}" \
		-f lavfi -i "sine=frequency=${p3}:duration=${BAR}" \
		-filter_complex "[0:a][1:a][2:a]amix=inputs=3:duration=longest:weights=1 0.8 0.7,volume=0.45,afade=t=in:d=0.2,afade=t=out:st=$(awk "BEGIN{print ${BAR}-0.4}"):d=0.4,lowpass=f=2200" \
		-ac 2 -ar 44100 "$dir/pad.wav"

	ffmpeg -y -i "$dir/arp.wav" -i "$dir/kicks.wav" -i "$dir/shakers.wav" -i "$dir/pad.wav" \
		-filter_complex "[0:a][1:a][2:a][3:a]amix=inputs=4:duration=longest:weights=1 1 0.55 0.75,apad" \
		-t "$BAR" -ac 2 -ar 44100 "$dir/bar.wav"
}

echo "== [1/3] building the summer groove =="
# I - V - vi - IV in C major
build_bar 523.25 659.25 783.99 1046.50 261.63 329.63 392.00 "$AUDIO_DIR/c"
build_bar 392.00 493.88 587.33 783.99 196.00 246.94 293.66 "$AUDIO_DIR/g"
build_bar 440.00 523.25 659.25 880.00 220.00 261.63 329.63 "$AUDIO_DIR/am"
build_bar 349.23 440.00 523.25 698.46 174.61 220.00 261.63 "$AUDIO_DIR/f"

{
	echo "file '$AUDIO_DIR/c/bar.wav'"
	echo "file '$AUDIO_DIR/g/bar.wav'"
	echo "file '$AUDIO_DIR/am/bar.wav'"
	echo "file '$AUDIO_DIR/f/bar.wav'"
} > "$AUDIO_DIR/prog.txt"
ffmpeg -y -f concat -safe 0 -i "$AUDIO_DIR/prog.txt" -c copy "$AUDIO_DIR/progression.wav"

REPS=$(awk "BEGIN{print int(${DURATION}/${PROG_LEN})+2}")
: > "$AUDIO_DIR/looplist.txt"
for _ in $(seq 1 "$REPS"); do
	echo "file '$AUDIO_DIR/progression.wav'" >> "$AUDIO_DIR/looplist.txt"
done
ffmpeg -y -f concat -safe 0 -i "$AUDIO_DIR/looplist.txt" -t "$DURATION" -c copy "$AUDIO_DIR/bed.wav"

# ============================================================
# accent stabs synced to every text/info appearance
# ============================================================
echo "== [2/3] building text-synced accents =="

ACCENT_DUR=0.2

ffmpeg -y -f lavfi -i "sine=frequency=1318.51:duration=0.18" \
	-af "afade=t=in:d=0.004,afade=t=out:st=0.02:d=0.16:curve=exp,volume=0.35" \
	-ac 2 -ar 44100 "$AUDIO_DIR/ping1.wav"
ffmpeg -y -f lavfi -i "sine=frequency=1975.53:duration=0.15" \
	-af "adelay=20|20,afade=t=in:d=0.004,afade=t=out:st=0.02:d=0.11:curve=exp,volume=0.25" \
	-ac 2 -ar 44100 "$AUDIO_DIR/ping2.wav"
ffmpeg -y -f lavfi -i "anoisesrc=d=0.06:c=white:r=44100" \
	-af "highpass=f=4000,afade=t=out:st=0.01:d=0.05,volume=0.15" \
	-ac 2 -ar 44100 "$AUDIO_DIR/tick.wav"
ffmpeg -y -i "$AUDIO_DIR/ping1.wav" -i "$AUDIO_DIR/ping2.wav" -i "$AUDIO_DIR/tick.wav" \
	-filter_complex "[0:a][1:a][2:a]amix=inputs=3:duration=longest,apad" \
	-t "$ACCENT_DUR" -ac 2 -ar 44100 "$AUDIO_DIR/accent.wav"

# timecodes (seconds) of every text/info reveal, from each scene's
# delay frames at 30fps with the longer slide durations
ACCENT_TIMES=(0.13 1.07 7.33 7.80 14.00 14.33 14.53 15.60 23.27 23.73 29.33 35.00 39.03 40.67 44.50 47.47 50.50 51.00 52.17 53.67 58.20 59.13 65.33 67.67 68.50)

: > "$AUDIO_DIR/accents_concat.txt"
prev_end=0
idx=0
for t in "${ACCENT_TIMES[@]}"; do
	gap=$(awk "BEGIN{g=${t}-${prev_end}; print (g<0)?0:g}")
	if awk "BEGIN{exit !(${gap}>0.001)}"; then
		sil_file="$AUDIO_DIR/sil_${idx}.wav"
		gen_silence "$gap" "$sil_file"
		echo "file '$sil_file'" >> "$AUDIO_DIR/accents_concat.txt"
	fi
	echo "file '$AUDIO_DIR/accent.wav'" >> "$AUDIO_DIR/accents_concat.txt"
	prev_end=$(awk "BEGIN{print ${t}+${ACCENT_DUR}}")
	idx=$((idx + 1))
done
tail_gap=$(awk "BEGIN{g=${DURATION}-${prev_end}; print (g<0)?0:g}")
if awk "BEGIN{exit !(${tail_gap}>0.001)}"; then
	gen_silence "$tail_gap" "$AUDIO_DIR/sil_tail.wav"
	echo "file '$AUDIO_DIR/sil_tail.wav'" >> "$AUDIO_DIR/accents_concat.txt"
fi

ffmpeg -y -f concat -safe 0 -i "$AUDIO_DIR/accents_concat.txt" -c copy "$AUDIO_DIR/accents_track.wav"

# ============================================================
# final mix
# ============================================================
echo "== [3/3] final mix =="

ffmpeg -y -i "$AUDIO_DIR/bed.wav" -i "$AUDIO_DIR/accents_track.wav" \
	-filter_complex "[0:a][1:a]amix=inputs=2:duration=longest:weights=1 1.1" \
	"$AUDIO_DIR/mixed.wav"

ffmpeg -y -i "$AUDIO_DIR/mixed.wav" -t "$DURATION" \
	-af "afade=t=in:d=1,afade=t=out:st=$(awk "BEGIN{print ${DURATION}-2}"):d=2" \
	"$AUDIO_DIR/music.wav"
ffmpeg -y -i "$AUDIO_DIR/music.wav" -af "loudnorm=I=-14:TP=-1:LRA=9" "$AUDIO_DIR/music_norm.wav"

ffmpeg -y -i "$VIDEO_RAW" -i "$AUDIO_DIR/music_norm.wav" \
	-c:v copy -c:a aac -b:a 192k -shortest \
	"$VIDEO_FINAL"

rm -rf "$AUDIO_DIR"
echo "Done: $VIDEO_FINAL"
