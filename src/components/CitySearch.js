import { useState } from 'react';
import { searchCity } from '../api';

function CitySearch({ onCityFound }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const result = await searchCity(query.trim());
      onCityFound(result);
      setQuery('');
    } catch (err) {
      if (err.response?.status === 404) {
        setError(`Could not find "${query}". Check spelling and try again.`);
      } else {
        setError('Something went wrong. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search any city — Delhi, Pune, Kolkata..."
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1.5px solid #e2e8f0',
            fontSize: '14px',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            outline: 'none',
            backgroundColor: 'white'
          }}
          onFocus={e => e.target.style.borderColor = '#64748b'}
          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          style={{
            padding: '12px 20px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: loading ? '#94a3b8' : '#1e293b',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
          }}
        >
          {loading ? 'Fetching...' : '🔍 Get Pulse'}
        </button>
      </div>

      {error && (
        <p style={{
          color: '#ef4444',
          fontSize: '13px',
          marginTop: '8px',
          marginBottom: 0
        }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default CitySearch;