import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { ProductCard } from '../components/ProductCard';
import { searchProducts } from '../services/api';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query.length < 2) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await searchProducts(query);
        if (response.success) {
          setResults(response.data);
        }
      } catch (err) {
        setError('Search failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="page search-page">
      <div className="page-header">
        <h1 className="page-title">Search Results</h1>
      </div>

      <SearchBar initialQuery={query} />

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Searching products...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
        </div>
      ) : results.length > 0 ? (
        <div className="search-results">
          <p className="results-count">{results.length} product{results.length !== 1 ? 's' : ''} found</p>
          <div className="product-grid">
            {results.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onClick={() => navigate(`/product/${product.barcode}`)}
              />
            ))}
          </div>
        </div>
      ) : query.length >= 2 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <p>No products found for "{query}"</p>
          <p className="empty-state-hint">
            Try scanning the barcode instead — we'll add it to our database!
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/scan')}>
            <span className="btn-icon">📷</span>
            Scan Barcode
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default SearchResults;
