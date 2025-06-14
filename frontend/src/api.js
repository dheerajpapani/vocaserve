const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export async function getVocabularies(page = 1, limit = 10, search = '') {
  try {
    const url = new URL(`${API_BASE}/vocabularies`);
    url.searchParams.set('page', page);
    url.searchParams.set('limit', limit);
    url.searchParams.set('search', search);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const result = await res.json(); // { data: [...], total: n }
    return result.data;
  } catch (err) {
    console.error('API error in getVocabularies()', err);
    return [];
  }
}

export async function getVocabularyById(id) {
  const res = await fetch(`${API_BASE}/vocabularies/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch vocabulary ${id}`);
  return await res.json(); // Should return combined object format
}

export async function deleteVocabulary(id) {
  const res = await fetch(`${API_BASE}/vocabularies/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`Failed to delete ${id}`);
}
