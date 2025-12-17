import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const SongsPage = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/songs')
      .then(res => res.json())
      .then(data => setSongs(data))
      .catch(err => console.error('Ошибка загрузки песен:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Загрузка песен...</div>;

  return (
    <div>
      <h1 className="page-title">Песни</h1>
      <ul className="song-list">
        {songs.map((song) => (
          <li key={song.id}>
            <Link className="song-link" to={`/songs/${song.id}`}>
              {song.title} — {song.artist}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SongsPage;
