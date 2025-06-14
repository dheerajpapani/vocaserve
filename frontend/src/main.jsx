import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { HashRouter } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter basename="/">
    <AuthProvider>
      <App />
    </AuthProvider>
  </HashRouter>
);
