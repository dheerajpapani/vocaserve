import { Link, useLocation } from 'react-router-dom';
import AdminLogin from './AdminLogin';

export default function Navbar() {
  const location = useLocation();

  // Determine if the current route is under "/vocabularies"
  const isActiveHome = location.pathname.startsWith('/vocabularies');

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        {/* Brand / Home link */}
        <Link
          to="/vocabularies"
          className={`navbar-brand${isActiveHome ? ' active' : ''}`}
        >
          <span className="logo-icon" aria-hidden="true">📘</span>
          <span className="brand-text">Vocabulary Manager</span>
        </Link>

        <div className="navbar-links">
          <a
            href="https://github.com/dheerajpapani/vocaserve"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-link"
          >
            🔗 GitHub
          </a>
          <AdminLogin />
        </div>
      </div>
    </nav>
  );
}
