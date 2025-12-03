import NavBar from "./Navbar.jsx";

function Layout({ children }) {
  return (
    <div className="app-container">
      <NavBar />
      <main>{children}</main>
    </div>
  );
}

export default Layout;
