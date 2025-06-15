import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ViewVocabulary from './pages/ViewVocabulary';
import AddVocabulary from './pages/AddVocabulary';
import EditVocabulary from './pages/EditVocabulary';
import DeleteVocabulary from './pages/DeleteVocabulary';
import NotFound from './pages/NotFound';
import Error500 from './pages/Error500';
import { ToastContainer } from 'react-toastify';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const { isAdmin } = useAuth();

  useEffect(() => {
    function adjustPadding() {
      const navbar = document.getElementById('navbar');
      if (navbar) {
        const height = navbar.offsetHeight + 16; // 16px gap below
        document.documentElement.style.setProperty('--dynamic-navbar-height', `${height}px`);
      }
    }

    adjustPadding();
    window.addEventListener('resize', adjustPadding);
    return () => window.removeEventListener('resize', adjustPadding);
  }, []);

  return (
    <>
      {/* Fixed navbar with ID for measurement */}
      <Navbar />

      {/* Main content area, offset below navbar via CSS */}
      <main className="page-content">
        <Routes>
          <Route path="/" element={<Navigate to="/vocabularies" replace />} />
          <Route path="/vocabularies" element={<Home />} />
          <Route path="/vocabularies/:id" element={<ViewVocabulary />} />
          <Route path="/add" element={isAdmin ? <AddVocabulary /> : <NotFound />} />
          <Route path="/edit/:id" element={isAdmin ? <EditVocabulary /> : <NotFound />} />
          <Route path="/delete/:id" element={isAdmin ? <DeleteVocabulary /> : <NotFound />} />
          <Route path="/error" element={<Error500 />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
      </main>
    </>
  );
}

export default App;
