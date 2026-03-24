import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="navbar-logo">🥗</span>
        <span className="navbar-title">NutriScan</span>
      </Link>
      <div className="navbar-links">
        <Link
          to="/"
          className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          Home
        </Link>
        <Link
          to="/scan"
          className={`navbar-link ${location.pathname === '/scan' ? 'active' : ''}`}
        >
          Scan
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
