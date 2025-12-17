import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="navbar">
      <Link to="/">Главная </Link>
      <Link to="/about">О сайте </Link>
      <Link to="/songs">Песни </Link>
    </nav>
  );
}

export default NavBar;