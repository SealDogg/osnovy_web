import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { parseChordPro } from "../utils/chordpro";
import { transposeChordLine } from "../components/transpose";

const SongPage = () => {
  const { songId } = useParams();
  const [song, setSong] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [semitones, setSemitones] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/songs/${songId}`)
      .then((res) => res.json())
      .then((data) => {
        setSong(data);
        const parsed = parseChordPro(data.content || "");
        setSections(parsed);
      })
      .catch((err) => {
        console.error("Ошибка загрузки песни:", err);
        setSong(null);
      })
      .finally(() => setLoading(false));
  }, [songId]);

  if (loading) return <div>Загрузка...</div>;
  if (!song) return <div>Песня не найдена</div>;

  return (
    <div>
      <h1 className="page-title">{song.title}</h1>
      <p className="page-subtitle">
        Исполнитель: {song.artist} · Тональность: {song.key || "—"}
      </p>

      <div style={{ marginBottom: 12 }}>
        <span>Транспонировать: </span>
        <button onClick={() => setSemitones((v) => v - 1)}>-</button>
        <span style={{ margin: "0 8px" }}>{semitones}</span>
        <button onClick={() => setSemitones((v) => v + 1)}>+</button>
      </div>

      <div>
        {sections.map((section, idx) => (
          <div key={idx} className={`song-section song-section--${section.type}`}>
            <h2>{section.label}</h2>
            {section.lines.map((line, i) => (
              <div key={i} className="song-line">
                <div className="song-chords">
                  {transposeChordLine(line.chords, semitones)}
                </div>
                <div className="song-lyrics">{line.lyrics}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongPage;
