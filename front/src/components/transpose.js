const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function transposeChord(chord, semitones) {
  const match = chord.match(/^([A-G][b#]?)(.*)$/);
  if (!match) return chord;

  const root = match[1];
  const suffix = match[2] || "";

  const flatMap = { Db: "C#", Eb: "D#", Gb: "F#", Ab: "G#", Bb: "A#" };
  const normalizedRoot = flatMap[root] || root;

  const index = NOTES.indexOf(normalizedRoot);
  if (index === -1) return chord;

  let newIndex = (index + semitones) % NOTES.length;
  if (newIndex < 0) newIndex += NOTES.length;

  const newRoot = NOTES[newIndex];
  return newRoot + suffix;
}

export function transposeChordLine(line, semitones) {
  return line
    .split(/(\s+)/)
    .map((token) => {
      if (/^[A-G][b#]?(m|maj7|m7|7|sus2|sus4|dim|aug)?$/.test(token)) {
        return transposeChord(token, semitones);
      }
      return token;
    })
    .join("");
}