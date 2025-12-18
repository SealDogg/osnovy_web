export class ChordProParser {
  constructor() {
    this.chordsPattern = /\[([A-Ga-g]#?b?(?:m|sus|dim|aug|\d)*(?:\/[A-Ga-g]#?b?)?)\]/g;
    this.sectionPattern = /^\[([^\]]+)\]$/;
    this.directivePattern = /^\{([^}]+):([^}]+)\}$/;
  }

  parse(chordproText) {
    const lines = chordproText.split('\n');
    const metadata = {};
    const sections = [];
    let currentSection = null;

    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
      let line = lines[lineNum].replace(/\s+/g, ' ').trim();

      // Директивы {title: Yesterday}
      if (this.directivePattern.test(line)) {
        const match = line.match(this.directivePattern);
        metadata[match[1].toLowerCase()] = match[2].trim();
        continue;
      }

      // Секции [Verse 1]
      const sectionMatch = line.match(this.sectionPattern);
      if (sectionMatch) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          type: this._getSectionType(sectionMatch[1]),
          title: sectionMatch[1],
          lines: []
        };
        continue;
      }

      // 🔥 ОСНОВНАЯ МАГИЯ: парсинг БЕЗ пробелов
      if (currentSection && line) {
        const parsedLine = this._parseLineWithPositions(line, lineNum);
        currentSection.lines.push(parsedLine);
      }
    }

    if (currentSection) sections.push(currentSection);

    return {
      metadata,
      sections,
      allChords: this._getAllChords(sections)
    };
  }

  _parseLineWithPositions(line, lineNum) {
    const tokens = [];
    let lastEnd = 0;
    const chordMatches = [...line.matchAll(this.chordsPattern)];

    // Добавляем все аккорды с позициями
    chordMatches.forEach((match, index) => {
      const chord = match[1];
      const start = match.index;
      const end = match.index + match[0].length;

      // Текст ДО аккорда
      if (start > lastEnd) {
        const lyrics = line.slice(lastEnd, start).trim();
        if (lyrics) {
          tokens.push({ type: 'lyrics', text: lyrics, start: lastEnd, end: start });
        }
      }

      // Сам аккорд
      tokens.push({ 
        type: 'chord', 
        chord, 
        start, 
        end,
        lineNum 
      });

      lastEnd = end;
    });

    // Последний кусок текста
    if (lastEnd < line.length) {
      const lyrics = line.slice(lastEnd).trim();
      if (lyrics) {
        tokens.push({ type: 'lyrics', text: lyrics, start: lastEnd, end: line.length });
      }
    }

    return {
      tokens,
      html: this._renderLineHtml(tokens),
      length: line.length
    };
  }

  _renderLineHtml(tokens) {
    return tokens.map(token => {
      if (token.type === 'chord') {
        return `<span class="chord" style="left: ${token.start}px">${token.chord}</span>`;
      }
      return `<span class="lyrics">${token.text}</span>`;
    }).join('');
  }

  _getSectionType(title) {
    const lower = title.toLowerCase();
    if (lower.includes('chor')) return 'chorus';
    if (lower.includes('bridge')) return 'bridge';
    if (lower.includes('intro')) return 'intro';
    return 'verse';
  }

  _getAllChords(sections) {
    const chords = new Set();
    sections.forEach(section => {
      section.lines.forEach(line => {
        line.tokens?.forEach(token => {
          if (token.type === 'chord') chords.add(token.chord);
        });
      });
    });
    return Array.from(chords).sort();
  }
}

export const parseChordPro = (text) => new ChordProParser().parse(text);