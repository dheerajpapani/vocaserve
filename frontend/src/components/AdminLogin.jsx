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
    <div className="navbar-login-wrapper">
      {isAdmin ? (
        <>
          <span className="admin-label">👑 Admin</span>
          <button onClick={logout}>
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
          />
          <button onClick={handleLogin}>
            Login
          </button>
          {error && <span className="text-red-300 text-sm">{error}</span>}
        </>
      )}
    </div>
  );
}
