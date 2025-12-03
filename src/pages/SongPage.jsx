// SongPage.jsx
import { useParams } from "react-router-dom";
import { useState } from "react";
import { songs } from "../data/songs";
import { transposeChordLine } from "../components/transpose.js";

const SongPage = () => {
  const { songId } = useParams();
  const song = songs.find((s) => s.id === songId);

  const [semitones, setSemitones] = useState(0);

  if (!song) return <div>Песня не найдена</div>;

  return (
    <div>
      <h1 className="page-title">{song.title}</h1>
      <p className="page-subtitle">
        Исполнитель: {song.artist} · Бой: {song.strum}
      </p>

      <div style={{ marginBottom: 12 }}>
        <span>Транспонировать: </span>
        <button onClick={() => setSemitones((v) => v - 1)}>-</button>
        <span style={{ margin: "0 8px" }}>{semitones}</span>
        <button onClick={() => setSemitones((v) => v + 1)}>+</button>
      </div>

      <div>
        {song.sections.map((section, idx) => (
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
