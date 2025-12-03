import { Link } from "react-router-dom";
import { songs } from "../data/songs";

const SongsPage = () => {
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
