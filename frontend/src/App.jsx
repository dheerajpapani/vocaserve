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

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <Routes>
          {/* Redirect root to /vocabularies */}
          <Route path="/" element={<Navigate to="/vocabularies" replace />} />

          {/* Main routes */}
          <Route path="/vocabularies" element={<Home />} />
          <Route path="/vocabularies/:id" element={<ViewVocabulary />} />

          {/* Admin routes */}
          <Route path="/add" element={isAdmin ? <AddVocabulary /> : <NotFound />} />
          <Route path="/edit/:id" element={isAdmin ? <EditVocabulary /> : <NotFound />} />
          <Route path="/delete/:id" element={isAdmin ? <DeleteVocabulary /> : <NotFound />} />

          {/* Error routes */}
          <Route path="/error" element={<Error500 />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}

export default App;
