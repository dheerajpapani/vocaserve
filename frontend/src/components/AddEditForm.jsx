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
      terms: terms
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-semibold">Title</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Description</label>
        <textarea
          className="w-full border px-3 py-2 rounded"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Terms (comma separated)</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          placeholder="e.g. term1, term2, term3"
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
      >
        {submitText}
      </button>
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}
