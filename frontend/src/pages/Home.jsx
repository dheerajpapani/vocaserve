// src/pages/Home.jsx
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
          typeof term === 'string' && term.toLowerCase().includes(keyword)
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
    const blob = new Blob(
      [JSON.stringify(filtered.slice(0, visibleCount), null, 2)],
      {
        type: 'application/json',
      }
    );
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

  if (loading)
    return (
      <p className="text-center mt-6">Loading vocabularies...</p>
    );

  return (
    // PageWrapper handles animations, but Layout ensures .page-content applies offset
    <PageWrapper>
      <div className="home-container">
        <div className="home-header">
          <h1 className="vocab-title">📚 Vocabulary List</h1>
          {isAdmin && (
            <Link to="/add" className="add-btn">
              ➕ Add New Vocabulary
            </Link>
          )}
        </div>

        <input
          type="text"
          placeholder="Search by title or term..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="export-buttons">
          <button onClick={handleExportJSON} className="json-btn">
            ⬇ Export JSON
          </button>
          <button onClick={handleExportCSV} className="csv-btn">
            ⬇ Export CSV
          </button>
        </div>

        {filtered.length === 0 ? (
          <p className="no-vocab">No matching vocabularies found.</p>
        ) : (
          <>
            <VocabularyList
              vocabularies={filtered.slice(0, visibleCount)}
              highlightTerm={search}
            />
            <div ref={loadMoreRef} className="load-more-trigger" />
          </>
        )}
      </div>
    </PageWrapper>
  );
}
