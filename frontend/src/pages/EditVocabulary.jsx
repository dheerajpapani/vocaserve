// src/pages/EditVocabulary.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageWrapper from '../components/PageWrapper';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export default function EditVocabulary() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [terms, setTerms] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [initialData, setInitialData] = useState({});

  const isDirty = () =>
    title !== initialData.title ||
    description !== initialData.description ||
    terms !== (initialData.terms || []).join(', ');

  useEffect(() => {
    fetch(`${API_BASE}/vocabularies/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then((data) => {
        setTitle(data.title || '');
        setDescription(data.description || '');
        setTerms((data.terms || []).join(', '));
        setInitialData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load vocabulary.');
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/vocabularies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          terms: terms
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });

      if (!res.ok) throw new Error('Update failed');

      toast.success('Vocabulary updated successfully!');
      navigate(`/vocabularies/${id}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update vocabulary.');
    }
  };

  const handleBack = () => {
    if (isDirty()) {
      const confirmLeave = confirm(
        'You have unsaved changes. Are you sure you want to go back?'
      );
      if (!confirmLeave) return;
    }
    navigate(`/vocabularies/${id}`);
  };

  if (loading)
    return (
      <p className="text-center mt-6">Loading...</p>
    );
  if (error)
    return (
      <p className="text-center mt-6" style={{ color: 'var(--color-danger)' }}>
        {error}
      </p>
    );

  return (
    <PageWrapper>
      <div className="form-container">
        <h2 className="vocab-detail-title">Edit Vocabulary</h2>
        <form onSubmit={handleSubmit}>
          {/* Title Field */}
          <div className="form-field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description Field */}
          <div className="form-field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Terms Field */}
          <div className="form-field">
            <label htmlFor="terms">Terms (comma separated)</label>
            <input
              id="terms"
              type="text"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="form-buttons">
            <button
              type="button"
              onClick={handleBack}
              className="btn-cancel"
            >
              ← Back
            </button>
            <button type="submit" className="btn-submit">
              💾 Save Changes
            </button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
