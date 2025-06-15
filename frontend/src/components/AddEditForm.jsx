// src/components/AddEditForm.jsx
import { useState, useEffect } from 'react';

export default function AddEditForm({ initialValues = {}, onSubmit, submitText }) {
  const [title, setTitle] = useState(initialValues.title || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [terms, setTerms] = useState(
    Array.isArray(initialValues.terms) ? initialValues.terms.join(', ') : ''
  );
  const [error, setError] = useState('');

  useEffect(() => {
    setTitle(initialValues.title || '');
    setDescription(initialValues.description || '');
    setTerms(Array.isArray(initialValues.terms) ? initialValues.terms.join(', ') : '');
  }, [initialValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      terms,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Title */}
      <div className="form-field">
        <label htmlFor="form-title">Title</label>
        <input
          id="form-title"
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Description */}
      <div className="form-field">
        <label htmlFor="form-description">Description</label>
        <textarea
          id="form-description"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Terms */}
      <div className="form-field">
        <label htmlFor="form-terms">Terms (comma separated)</label>
        <input
          id="form-terms"
          type="text"
          placeholder="e.g. term1, term2, term3"
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
        />
      </div>

      {/* Submit */}
      <div className="form-buttons">
        <button type="submit" className="btn-submit">
          {submitText}
        </button>
      </div>

      {error && (
        <p className="text-center mt-2" style={{ color: 'var(--color-danger)' }}>
          {error}
        </p>
      )}
    </form>
  );
}
