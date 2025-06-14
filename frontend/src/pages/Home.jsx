import { useEffect, useState, useRef } from 'react';
import { getVocabularies } from '../api';
import { Link } from 'react-router-dom';
import VocabularyList from '../components/VocabularyList';
import PageWrapper from '../components/PageWrapper';
import { saveAs } from 'file-saver';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [vocabularies, setVocabularies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const loadMoreRef = useRef();
  const { isAdmin } = useAuth();

  useEffect(() => {
    getVocabularies()
      .then((data) => {
        setVocabularies(data || []);
        setFiltered(data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching vocabularies:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) {
      setFiltered(vocabularies);
    } else {
      const filteredResults = vocabularies.filter((vocab) =>
        vocab.title.toLowerCase().includes(keyword) ||
        (vocab.terms || []).some((term) =>
          typeof term === 'string' &&
          term.toLowerCase().includes(keyword)
        )
      );
      setFiltered(filteredResults);
    }
    setVisibleCount(5);
  }, [search, vocabularies]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && visibleCount < filtered.length) {
          setVisibleCount((prev) => prev + 5);
        }
      },
      { threshold: 1 }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [filtered, visibleCount]);

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(filtered.slice(0, visibleCount), null, 2)], {
      type: 'application/json',
    });
    saveAs(blob, 'vocabularies.json');
  };

  const handleExportCSV = () => {
    const csvHeader = 'Title,Description,Terms\n';
    const csvRows = filtered.slice(0, visibleCount).map((vocab) =>
      `"${vocab.title}","${vocab.description}","${(vocab.terms || []).join(';')}"`
    );
    const blob = new Blob([csvHeader + csvRows.join('\n')], {
      type: 'text/csv',
    });
    saveAs(blob, 'vocabularies.csv');
  };

  if (loading) return <p className="text-center mt-10">Loading vocabularies...</p>;

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Vocabulary List</h1>
          {isAdmin && (
            <Link to="/add" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              ➕ Add New Vocabulary
            </Link>
          )}
        </div>

        <input
          type="text"
          placeholder="Search by title or term..."
          className="w-full border px-3 py-2 rounded mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-3 mb-6">
          <button
            onClick={handleExportJSON}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ⬇ Export JSON
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            ⬇ Export CSV
          </button>
        </div>

        {filtered.length === 0 ? (
          <p className="text-gray-600 text-center mt-10">No matching vocabularies found.</p>
        ) : (
          <>
            <VocabularyList vocabularies={filtered.slice(0, visibleCount)} highlightTerm={search} />
            <div ref={loadMoreRef} className="h-1 mt-2" />
          </>
        )}
      </div>
    </PageWrapper>
  );
}
