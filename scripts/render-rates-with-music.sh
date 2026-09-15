#!/usr/bin/env bash
# Renders the RatesVideo composition and adds an original, royalty-free
# synthesized background track: a rhythmic arpeggio (8th-note plucks) +
# a soft kick pulse on beats 1 & 3, over an Am-F-C-G pad bed, for a more
# energetic/"dynamic" feel than a plain ambient pad.
set -euo pipefail

cd "$(dirname "$0")/.."

VIDEO_RAW="out/kerjean-taux-immobilier.mp4"
VIDEO_FINAL="out/kerjean-taux-immobilier-musique.mp4"
AUDIO_DIR="$(mktemp -d)"
DURATION=45

BPM=128
EIGHTH=$(awk "BEGIN{print 60/${BPM}/2}")       # ~0.234375s
BAR=$(awk "BEGIN{print ${EIGHTH}*8}")           # ~1.875s
CHORD_LEN=$(awk "BEGIN{print (${DURATION}+3)/4}") # 4 chords, 3x 1s crossfades

mkdir -p out

npx remotion render src/index.ts RatesVideo "$VIDEO_RAW"

# --- one 8th-note "pluck" note: quick attack, exponential-ish decay ---
gen_note () {
	local freq=$1 out=$2
	ffmpeg -y -f lavfi -i "sine=frequency=${freq}:duration=${EIGHTH}" \
		-af "afade=t=in:d=0.006,afade=t=out:st=0.03:d=$(awk "BEGIN{print ${EIGHTH}-0.03}"):curve=exp,volume=0.55" \
		-ac 2 "$out"
}

# --- a short low "kick" thump ---
gen_kick () {
	local out=$1
	ffmpeg -y -f lavfi -i "sine=frequency=95:duration=0.15" \
		-af "afade=t=in:d=0.003,afade=t=out:st=0.02:d=0.13:curve=exp,volume=0.9" \
		-ac 2 "$out"
}

# --- build one bar (8 eighth notes) of arpeggio + kick for a chord ---
# pattern indices into the 4 chord tones: root,3rd,5th,octave,5th,3rd,root,3rd
build_bar () {
	local f1=$1 f2=$2 f3=$3 f4=$4 chord_dir=$5
	mkdir -p "$chord_dir"
	gen_note "$f1" "$chord_dir/n0.wav"
	gen_note "$f2" "$chord_dir/n1.wav"
	gen_note "$f3" "$chord_dir/n2.wav"
	gen_note "$f4" "$chord_dir/n3.wav"
	gen_kick "$chord_dir/kick.wav"

	{
		echo "file 'n0.wav'"
		echo "file 'n1.wav'"
		echo "file 'n2.wav'"
		echo "file 'n3.wav'"
		echo "file 'n2.wav'"
		echo "file 'n1.wav'"
		echo "file 'n0.wav'"
		echo "file 'n1.wav'"
	} > "$chord_dir/pattern.txt"
	ffmpeg -y -f concat -safe 0 -i "$chord_dir/pattern.txt" -c copy "$chord_dir/arp.wav"

	local silence_half
	silence_half=$(awk "BEGIN{print ${BAR}/2 - 0.15}")
	ffmpeg -y -f lavfi -i "anullsrc=r=44100:cl=stereo" -t "$silence_half" "$chord_dir/silence.wav"
	{
		echo "file 'kick.wav'"
		echo "file 'silence.wav'"
		echo "file 'kick.wav'"
		echo "file 'silence.wav'"
	} > "$chord_dir/kickpattern.txt"
	ffmpeg -y -f concat -safe 0 -i "$chord_dir/kickpattern.txt" -c copy "$chord_dir/kicks.wav"

	ffmpeg -y -i "$chord_dir/arp.wav" -i "$chord_dir/kicks.wav" \
		-filter_complex "[0:a][1:a]amix=inputs=2:duration=first:weights=1 1" \
		"$chord_dir/bar.wav"
}

# --- loop the 1-bar clip enough times to cover CHORD_LEN, then trim exactly ---
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

# --- sustained pad chord (harmonic bed, same technique as before) ---
gen_pad () {
	local f1=$1 f2=$2 f3=$3 out=$4 length=$5
	ffmpeg -y -f lavfi -i "sine=frequency=${f1}:duration=${length}" \
		-f lavfi -i "sine=frequency=${f2}:duration=${length}" \
		-f lavfi -i "sine=frequency=${f3}:duration=${length}" \
		-filter_complex "[0:a][1:a][2:a]amix=inputs=3:duration=longest:weights=1 0.8 0.7,volume=0.4,afade=t=in:d=1,afade=t=out:st=$(awk "BEGIN{print ${length}-1.2}"):d=1.2,lowpass=f=1600" \
		-ac 2 "$out"
}

echo "== building bars =="
build_bar 220.00 261.63 329.63 440.00 "$AUDIO_DIR/am"   # A minor
build_bar 174.61 220.00 261.63 349.23 "$AUDIO_DIR/f"    # F major
build_bar 261.63 329.63 392.00 523.25 "$AUDIO_DIR/c"    # C major
build_bar 196.00 246.94 293.66 392.00 "$AUDIO_DIR/g"    # G major

echo "== looping arpeggio blocks =="
loop_bar_to_length "$AUDIO_DIR/am/bar.wav" "$AUDIO_DIR/arp_am.wav" "$CHORD_LEN"
loop_bar_to_length "$AUDIO_DIR/f/bar.wav" "$AUDIO_DIR/arp_f.wav" "$CHORD_LEN"
loop_bar_to_length "$AUDIO_DIR/c/bar.wav" "$AUDIO_DIR/arp_c.wav" "$CHORD_LEN"
loop_bar_to_length "$AUDIO_DIR/g/bar.wav" "$AUDIO_DIR/arp_g.wav" "$CHORD_LEN"

echo "== crossfading arpeggio blocks =="
ffmpeg -y -i "$AUDIO_DIR/arp_am.wav" -i "$AUDIO_DIR/arp_f.wav" -filter_complex "acrossfade=d=1" "$AUDIO_DIR/arp_step1.wav"
ffmpeg -y -i "$AUDIO_DIR/arp_step1.wav" -i "$AUDIO_DIR/arp_c.wav" -filter_complex "acrossfade=d=1" "$AUDIO_DIR/arp_step2.wav"
ffmpeg -y -i "$AUDIO_DIR/arp_step2.wav" -i "$AUDIO_DIR/arp_g.wav" -filter_complex "acrossfade=d=1" "$AUDIO_DIR/arp_full.wav"

echo "== building + crossfading pad bed =="
gen_pad 220.00 261.63 329.63 "$AUDIO_DIR/pad_am.wav" "$CHORD_LEN"
gen_pad 174.61 220.00 261.63 "$AUDIO_DIR/pad_f.wav" "$CHORD_LEN"
gen_pad 261.63 329.63 392.00 "$AUDIO_DIR/pad_c.wav" "$CHORD_LEN"
gen_pad 196.00 246.94 293.66 "$AUDIO_DIR/pad_g.wav" "$CHORD_LEN"
ffmpeg -y -i "$AUDIO_DIR/pad_am.wav" -i "$AUDIO_DIR/pad_f.wav" -filter_complex "acrossfade=d=1" "$AUDIO_DIR/pad_step1.wav"
ffmpeg -y -i "$AUDIO_DIR/pad_step1.wav" -i "$AUDIO_DIR/pad_c.wav" -filter_complex "acrossfade=d=1" "$AUDIO_DIR/pad_step2.wav"
ffmpeg -y -i "$AUDIO_DIR/pad_step2.wav" -i "$AUDIO_DIR/pad_g.wav" -filter_complex "acrossfade=d=1" "$AUDIO_DIR/pad_full.wav"

echo "== final mix =="
ffmpeg -y -i "$AUDIO_DIR/arp_full.wav" -i "$AUDIO_DIR/pad_full.wav" \
	-filter_complex "[0:a][1:a]amix=inputs=2:duration=longest:weights=1 0.7" \
	"$AUDIO_DIR/mixed.wav"

ffmpeg -y -i "$AUDIO_DIR/mixed.wav" -t "$DURATION" -af "afade=t=out:st=$((DURATION - 2)):d=2" "$AUDIO_DIR/music.wav"
ffmpeg -y -i "$AUDIO_DIR/music.wav" -af "loudnorm=I=-14:TP=-1:LRA=9" "$AUDIO_DIR/music_norm.wav"

ffmpeg -y -i "$VIDEO_RAW" -i "$AUDIO_DIR/music_norm.wav" \
	-c:v copy -c:a aac -b:a 192k -shortest \
	"$VIDEO_FINAL"

rm -rf "$AUDIO_DIR"
echo "Done: $VIDEO_FINAL"
