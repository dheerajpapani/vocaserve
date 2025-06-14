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
  const [initialData, setInitialData] = useState('');

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
          title,
          description,
          terms: terms.split(',').map((t) => t.trim()).filter(Boolean),
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
      const confirmLeave = confirm('You have unsaved changes. Are you sure you want to go back?');
      if (!confirmLeave) return;
    }
    navigate(`/vocabularies/${id}`);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;

  return (
    <PageWrapper>
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Edit Vocabulary</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Title</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              className="w-full border px-3 py-2 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div>
            <label className="block mb-1 font-semibold">Terms (comma separated)</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              💾 Save Changes
            </button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
