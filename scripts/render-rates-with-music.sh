#!/usr/bin/env bash
# Renders the RatesVideo composition and adds an original, royalty-free
# music track with two layers:
#   1. a continuous rhythmic bed (8th-note arpeggio + kick pulse over an
#      Am-F-C-G pad), same technique as before
#   2. a bright "stab" accent placed at the exact timecode of every text/
#      info appearance in the video, so the music audibly follows the cuts
set -euo pipefail

cd "$(dirname "$0")/.."

VIDEO_RAW="out/kerjean-taux-immobilier.mp4"
VIDEO_FINAL="out/kerjean-taux-immobilier-musique.mp4"
AUDIO_DIR="$(mktemp -d)"

TOTAL_FRAMES=1510
FPS=30
DURATION=$(awk "BEGIN{print ${TOTAL_FRAMES}/${FPS}}")

BPM=128
EIGHTH=$(awk "BEGIN{print 60/${BPM}/2}")
BAR=$(awk "BEGIN{print ${EIGHTH}*8}")
CHORD_LEN=$(awk "BEGIN{print (${DURATION}+3)/4}")

mkdir -p out

npx remotion render src/index.ts RatesVideo "$VIDEO_RAW"

# ============================================================
# LAYER 1 — rhythmic bed (arpeggio + kick + pad)
# ============================================================

gen_note () {
	local freq=$1 out=$2
	ffmpeg -y -f lavfi -i "sine=frequency=${freq}:duration=${EIGHTH}" \
		-af "afade=t=in:d=0.006,afade=t=out:st=0.03:d=$(awk "BEGIN{print ${EIGHTH}-0.03}"):curve=exp,volume=0.55" \
		-ac 2 "$out"
}

gen_kick () {
	local out=$1
	ffmpeg -y -f lavfi -i "sine=frequency=95:duration=0.15" \
		-af "afade=t=in:d=0.003,afade=t=out:st=0.02:d=0.13:curve=exp,volume=0.9" \
		-ac 2 "$out"
}

build_bar () {
	local f1=$1 f2=$2 f3=$3 f4=$4 chord_dir=$5
	mkdir -p "$chord_dir"
	gen_note "$f1" "$chord_dir/n0.wav"
	gen_note "$f2" "$chord_dir/n1.wav"
	gen_note "$f3" "$chord_dir/n2.wav"
	gen_note "$f4" "$chord_dir/n3.wav"
	gen_kick "$chord_dir/kick.wav"

	{
		echo "file 'n0.wav'"; echo "file 'n1.wav'"; echo "file 'n2.wav'"; echo "file 'n3.wav'"
		echo "file 'n2.wav'"; echo "file 'n1.wav'"; echo "file 'n0.wav'"; echo "file 'n1.wav'"
	} > "$chord_dir/pattern.txt"
	ffmpeg -y -f concat -safe 0 -i "$chord_dir/pattern.txt" -c copy "$chord_dir/arp.wav"

	local silence_half
	silence_half=$(awk "BEGIN{print ${BAR}/2 - 0.15}")
	ffmpeg -y -f lavfi -i "anullsrc=r=44100:cl=stereo" -t "$silence_half" "$chord_dir/silence.wav"
	{
		echo "file 'kick.wav'"; echo "file 'silence.wav'"
		echo "file 'kick.wav'"; echo "file 'silence.wav'"
	} > "$chord_dir/kickpattern.txt"
	ffmpeg -y -f concat -safe 0 -i "$chord_dir/kickpattern.txt" -c copy "$chord_dir/kicks.wav"

	ffmpeg -y -i "$chord_dir/arp.wav" -i "$chord_dir/kicks.wav" \
		-filter_complex "[0:a][1:a]amix=inputs=2:duration=first:weights=1 1" \
		"$chord_dir/bar.wav"
}

loop_bar_to_length () {
	local bar=$1 out=$2 length=$3
	local reps
	reps=$(awk "BEGIN{r=int(${length}/${BAR})+2; print r}")
	: > "$AUDIO_DIR/looplist.txt"
	for _ in $(seq 1 "$reps"); do
		echo "file '$bar'" >> "$AUDIO_DIR/looplist.txt"
	done
	ffmpeg -y -f concat -safe 0 -i "$AUDIO_DIR/looplist.txt" -t "$length" -c copy "$out"
}

gen_pad () {
	local f1=$1 f2=$2 f3=$3 out=$4 length=$5
	ffmpeg -y -f lavfi -i "sine=frequency=${f1}:duration=${length}" \
		-f lavfi -i "sine=frequency=${f2}:duration=${length}" \
		-f lavfi -i "sine=frequency=${f3}:duration=${length}" \
		-filter_complex "[0:a][1:a][2:a]amix=inputs=3:duration=longest:weights=1 0.8 0.7,volume=0.4,afade=t=in:d=1,afade=t=out:st=$(awk "BEGIN{print ${length}-1.2}"):d=1.2,lowpass=f=1600" \
		-ac 2 "$out"
}

echo "== [1/3] building rhythmic bed =="
build_bar 220.00 261.63 329.63 440.00 "$AUDIO_DIR/am"
build_bar 174.61 220.00 261.63 349.23 "$AUDIO_DIR/f"
build_bar 261.63 329.63 392.00 523.25 "$AUDIO_DIR/c"
build_bar 196.00 246.94 293.66 392.00 "$AUDIO_DIR/g"

loop_bar_to_length "$AUDIO_DIR/am/bar.wav" "$AUDIO_DIR/arp_am.wav" "$CHORD_LEN"
loop_bar_to_length "$AUDIO_DIR/f/bar.wav" "$AUDIO_DIR/arp_f.wav" "$CHORD_LEN"
loop_bar_to_length "$AUDIO_DIR/c/bar.wav" "$AUDIO_DIR/arp_c.wav" "$CHORD_LEN"
loop_bar_to_length "$AUDIO_DIR/g/bar.wav" "$AUDIO_DIR/arp_g.wav" "$CHORD_LEN"

ffmpeg -y -i "$AUDIO_DIR/arp_am.wav" -i "$AUDIO_DIR/arp_f.wav" -filter_complex "acrossfade=d=1" "$AUDIO_DIR/arp_step1.wav"
ffmpeg -y -i "$AUDIO_DIR/arp_step1.wav" -i "$AUDIO_DIR/arp_c.wav" -filter_complex "acrossfade=d=1" "$AUDIO_DIR/arp_step2.wav"
ffmpeg -y -i "$AUDIO_DIR/arp_step2.wav" -i "$AUDIO_DIR/arp_g.wav" -filter_complex "acrossfade=d=1" "$AUDIO_DIR/arp_full.wav"

gen_pad 220.00 261.63 329.63 "$AUDIO_DIR/pad_am.wav" "$CHORD_LEN"
gen_pad 174.61 220.00 261.63 "$AUDIO_DIR/pad_f.wav" "$CHORD_LEN"
gen_pad 261.63 329.63 392.00 "$AUDIO_DIR/pad_c.wav" "$CHORD_LEN"
gen_pad 196.00 246.94 293.66 "$AUDIO_DIR/pad_g.wav" "$CHORD_LEN"
ffmpeg -y -i "$AUDIO_DIR/pad_am.wav" -i "$AUDIO_DIR/pad_f.wav" -filter_complex "acrossfade=d=1" "$AUDIO_DIR/pad_step1.wav"
ffmpeg -y -i "$AUDIO_DIR/pad_step1.wav" -i "$AUDIO_DIR/pad_c.wav" -filter_complex "acrossfade=d=1" "$AUDIO_DIR/pad_step2.wav"
ffmpeg -y -i "$AUDIO_DIR/pad_step2.wav" -i "$AUDIO_DIR/pad_g.wav" -filter_complex "acrossfade=d=1" "$AUDIO_DIR/pad_full.wav"

ffmpeg -y -i "$AUDIO_DIR/arp_full.wav" -i "$AUDIO_DIR/pad_full.wav" \
	-filter_complex "[0:a][1:a]amix=inputs=2:duration=longest:weights=1 0.7" \
	"$AUDIO_DIR/bed.wav"

# ============================================================
# LAYER 2 — accent stabs synced to every text/info appearance
# ============================================================
echo "== [2/3] building text-synced accents =="

ACCENT_DUR=0.2

# one shared "stab": two bright pings (a fifth apart) + a short noise tick
ffmpeg -y -f lavfi -i "sine=frequency=1318.51:duration=0.18" \
	-af "afade=t=in:d=0.004,afade=t=out:st=0.02:d=0.16:curve=exp,volume=0.35" \
	-ac 2 "$AUDIO_DIR/ping1.wav"
ffmpeg -y -f lavfi -i "sine=frequency=1975.53:duration=0.15" \
	-af "adelay=20|20,afade=t=in:d=0.004,afade=t=out:st=0.02:d=0.11:curve=exp,volume=0.25" \
	-ac 2 "$AUDIO_DIR/ping2.wav"
ffmpeg -y -f lavfi -i "anoisesrc=d=0.06:c=white" \
	-af "highpass=f=4000,afade=t=out:st=0.01:d=0.05,volume=0.15" \
	-ac 2 "$AUDIO_DIR/tick.wav"
ffmpeg -y -i "$AUDIO_DIR/ping1.wav" -i "$AUDIO_DIR/ping2.wav" -i "$AUDIO_DIR/tick.wav" \
	-filter_complex "[0:a][1:a][2:a]amix=inputs=3:duration=longest" \
	-t "$ACCENT_DUR" "$AUDIO_DIR/accent.wav"

# timecodes (seconds) of every text/info appearance in the current cut —
# derived directly from each scene's delay/reveal frames at 30fps
ACCENT_TIMES=(0.13 1.07 4.33 4.80 8.00 8.33 8.53 9.60 14.27 14.73 17.33 22.00 25.50 26.67 30.17 32.47 34.50 35.00 36.17 37.67 40.20 41.13 44.33 46.67 47.50)

: > "$AUDIO_DIR/accents_concat.txt"
prev_end=0
for t in "${ACCENT_TIMES[@]}"; do
	gap=$(awk "BEGIN{g=${t}-${prev_end}; print (g<0)?0:g}")
	if awk "BEGIN{exit !(${gap}>0.001)}"; then
		local_silence="$AUDIO_DIR/sil_$(printf '%s' "$t" | tr '.' '_').wav"
		ffmpeg -y -f lavfi -i "anullsrc=r=44100:cl=stereo" -t "$gap" "$local_silence"
		echo "file '$local_silence'" >> "$AUDIO_DIR/accents_concat.txt"
	fi
	echo "file '$AUDIO_DIR/accent.wav'" >> "$AUDIO_DIR/accents_concat.txt"
	prev_end=$(awk "BEGIN{print ${t}+${ACCENT_DUR}}")
done
tail_gap=$(awk "BEGIN{g=${DURATION}-${prev_end}; print (g<0)?0:g}")
if awk "BEGIN{exit !(${tail_gap}>0.001)}"; then
	ffmpeg -y -f lavfi -i "anullsrc=r=44100:cl=stereo" -t "$tail_gap" "$AUDIO_DIR/sil_tail.wav"
	echo "file '$AUDIO_DIR/sil_tail.wav'" >> "$AUDIO_DIR/accents_concat.txt"
fi

ffmpeg -y -f concat -safe 0 -i "$AUDIO_DIR/accents_concat.txt" -c copy "$AUDIO_DIR/accents_track.wav"

# ============================================================
# final mix
# ============================================================
echo "== [3/3] final mix =="

ffmpeg -y -i "$AUDIO_DIR/bed.wav" -i "$AUDIO_DIR/accents_track.wav" \
	-filter_complex "[0:a][1:a]amix=inputs=2:duration=longest:weights=0.85 1.3" \
	"$AUDIO_DIR/mixed.wav"

ffmpeg -y -i "$AUDIO_DIR/mixed.wav" -t "$DURATION" \
	-af "afade=t=out:st=$(awk "BEGIN{print ${DURATION}-2}"):d=2" \
	"$AUDIO_DIR/music.wav"
ffmpeg -y -i "$AUDIO_DIR/music.wav" -af "loudnorm=I=-14:TP=-1:LRA=9" "$AUDIO_DIR/music_norm.wav"

ffmpeg -y -i "$VIDEO_RAW" -i "$AUDIO_DIR/music_norm.wav" \
	-c:v copy -c:a aac -b:a 192k -shortest \
	"$VIDEO_FINAL"

rm -rf "$AUDIO_DIR"
echo "Done: $VIDEO_FINAL"
