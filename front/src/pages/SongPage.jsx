import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { parseChordPro } from "../utils/chordpro";

const SongPage = () => {
  const { songId } = useParams();
  const [song, setSong] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [semitones, setSemitones] = useState(0);
  const [allChords, setAllChords] = useState([]);

  useEffect(() => {
    const loadSong = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/songs/${songId}`);
        if (!response.ok) throw new Error('Песня не найдена');
        
        const data = await response.json();
        setSong(data);
        
        if (data.content) {
          const parsed = parseChordPro(data.content);
          setSections(parsed.sections);
          setAllChords(parsed.allChords || []);
        }
      } catch (err) {
        console.error("Ошибка:", err);
        setSong(null);
      } finally {
        setLoading(false);
      }
    };

    if (songId) loadSong();
  }, [songId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div>Загрузка песни...</div>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="not-found">
        <h2>Песня не найдена</h2>
      </div>
    );
  }

  return (
    <div className="song-page">
      <header className="song-header">
        <h1 className="page-title">{song.title}</h1>
        <p className="page-subtitle">
          {song.artist && `Исполнитель: ${song.artist}`}
          {song.key && ` · Тональность: ${song.key}`}
          {allChords.length > 0 && ` · Аккорды: ${allChords.slice(0, 5).join(', ')}${allChords.length > 5 ? '...' : ''}`}
        </p>
      </header>

      <div className="controls">
        <label>Транспонировать:</label>
        <button 
          onClick={() => setSemitones(s => Math.max(-12, s - 1))}
          className="control-btn"
        >
          -
        </button>
        <span className="semitones-display">{semitones}</span>
        <button 
          onClick={() => setSemitones(s => Math.min(12, s + 1))}
          className="control-btn"
        >
          +
        </button>
      </div>

      <div className="song-content">
        {sections.length === 0 ? (
          <div className="no-chords">
            Аккорды не найдены в песне
          </div>
        ) : (
          sections.map((section, idx) => (
            <section key={idx} className={`song-section song-section--${section.type}`}>
              <h2 className="section-title">{section.title}</h2>
              <div className="lyrics-container">
                {section.lines.map((line, lineIdx) => (
                  <div key={lineIdx} className="song-line">
                    <div 
                      className="lyrics-background"
                      dangerouslySetInnerHTML={{ __html: line.html }}
                    />
                    <div className="lyrics-text">
                      {line.lyrics || line.text || ''}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
};

export default SongPage;
