import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddEditForm from '../components/AddEditForm';
import PageWrapper from '../components/PageWrapper';

export default function AddVocabulary() {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formKey, setFormKey] = useState(Date.now());
  const navigate = useNavigate();

  const handleAdd = async ({ title, description, terms }) => {
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/vocabularies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          terms: terms
            .split(',')
            .map(t => t.trim())
            .filter(Boolean),
        }),
      });

      if (!res.ok) throw new Error('Failed to add vocabulary');
      setSuccess('Vocabulary added successfully!');
      setFormKey(Date.now()); // re-mount the form to reset
    } catch (err) {
      console.error(err);
      setError('Failed to add vocabulary.');
    }
  };

  return (
    <PageWrapper>
      <div className="form-container">
        <h1 className="vocab-detail-title">Add Vocabulary</h1>
        <AddEditForm
          key={formKey}
          onSubmit={handleAdd}
          submitText="Add Vocabulary"
        />
        {/* Back button */}
        <div className="form-buttons">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate('/vocabularies')}
          >
            ⬅ Back
          </button>
        </div>
        {/* Messages */}
        {error && (
          <p className="text-center mt-2" style={{ color: 'var(--color-danger)' }}>
            {error}
          </p>
        )}
        {success && (
          <p className="text-center mt-2" style={{ color: 'var(--color-secondary)' }}>
            {success}
          </p>
        )}
      </div>
    </PageWrapper>
  );
}
