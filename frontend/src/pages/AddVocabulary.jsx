import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddEditForm from '../components/AddEditForm';
import PageWrapper from '../components/PageWrapper';

export default function AddVocabulary() {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formKey, setFormKey] = useState(Date.now());

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
            .filter(Boolean)
        })
      });

      if (!res.ok) throw new Error('Failed to add vocabulary');
      setSuccess('Vocabulary added successfully!');
      setFormKey(Date.now()); // re-mount the form to reset
    } catch (err) {
      console.error(err);
      setError('Failed to add vocabulary.');
    }
  };

  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Add Vocabulary</h1>
        <AddEditForm
          key={formKey}
          onSubmit={handleAdd}
          submitText="Add Vocabulary"
        />
        <button onClick={() => navigate(`/vocabularies`)}>⬅ Back</button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">{success}</p>}
      </div>
    </PageWrapper>
  );
}
