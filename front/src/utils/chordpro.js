// Возвращает массив секций, каждая секция = { type, label, lines[] }
// line = { chords: string, lyrics: string }
export function parseChordPro(content) {
  const lines = content.split('\n');

  const resultLines = [];

  for (const raw of lines) {
    const line = raw.trimEnd();

    // Пустые строки – разделитель абзацев
    if (line === '') {
      resultLines.push({ chords: '', lyrics: '' });
      continue;
    }

    // Директивы {title:}, {artist:}, {verse} пропускаем
    if (line.startsWith('{') && line.endsWith('}')) {
      continue;
    }

    // Если в строке нет аккордов – просто текст
    if (!/\[[A-G][#b]?(?:m|maj|min|dim|sus|add)?\d*\]/.test(line)) {
      resultLines.push({ chords: '', lyrics: line });
      continue;
    }

    // Строим две строки: chordsLine и lyricsLine с тем же количеством символов
    let chordsLine = '';
    let lyricsLine = '';
    let i = 0;

    while (i < line.length) {
      if (line[i] === '[') {
        const end = line.indexOf(']', i + 1);
        if (end === -1) {
          // нет закрывающей скобки — считаем остальное текстом
          lyricsLine += line.slice(i);
          chordsLine += ' '.repeat(line.length - i);
          break;
        }
        const chord = line.slice(i + 1, end); // без скобок

        // В chordsLine пишем сам аккорд, в lyricsLine — пробелы той же длины
        chordsLine += chord;
        lyricsLine += ' '.repeat(end - i + 1);

        i = end + 1;
      } else {
        chordsLine += ' ';
        lyricsLine += line[i];
        i += 1;
      }
    }

    resultLines.push({
      chords: chordsLine.trimEnd(),
      lyrics: lyricsLine.trimStart(),
    });
  }

  return [
    {
      type: 'verse',
      label: 'Песня',
      lines: resultLines,
    },
  ];
}
