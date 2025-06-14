import { Link } from 'react-router-dom';
import AdminLogin from './AdminLogin';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 shadow">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/vocabularies" className="text-lg font-bold hover:text-gray-100">
          📘 Vocabulary Manager
        </Link>
        <div className="flex gap-6 items-center">
          <a
            href="https://github.com/your-username/vocabulary-manager"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200"
          >
            🔗 GitHub
          </a>
          <AdminLogin />
        </div>
      </div>
    </nav>
  );
}
