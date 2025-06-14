import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { isAdmin, login, logout } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (password === 'admin123') {
      login();
      setPassword('');
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="flex items-center gap-4">
      {isAdmin ? (
        <>
          <span className="text-sm">👑 Admin</span>
          <button onClick={logout} className="text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600">
            Logout
          </button>
        </>
      ) : (
        <>
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-2 py-1 rounded border"
          />
          <button onClick={handleLogin} className="text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600">
            Login
          </button>
          {error && <span className="text-red-300 text-sm">{error}</span>}
        </>
      )}
    </div>
  );
}
