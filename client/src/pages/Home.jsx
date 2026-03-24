import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { ProductCard } from '../components/ProductCard';
import { getRecentProducts } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await getRecentProducts();
        if (response.success) {
          setRecentProducts(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch recent products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, []);

  return (
    <div className="page home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🇮🇳 Made for India</div>
          <h1 className="hero-title">
            Scan. Search. <span className="gradient-text">Know Your Food.</span>
          </h1>
          <p className="hero-subtitle">
            Get instant nutritional information for any packaged food product.
            Just scan the barcode or search by name.
          </p>
        </div>

        <div className="hero-actions">
          <SearchBar />
          <div className="hero-divider">
            <span>or</span>
          </div>
          <button
            className="btn btn-scan"
            onClick={() => navigate('/scan')}
          >
            <span className="btn-icon">📷</span>
            Scan Barcode
          </button>
        </div>
      </section>

      {/* Recently Scanned */}
      <section className="section">
        <h2 className="section-title">
          <span className="section-icon">🕐</span>
          Recently Scanned
        </h2>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : recentProducts.length > 0 ? (
          <div className="product-grid">
            {recentProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onClick={() => navigate(`/product/${product.barcode}`)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <p>No products scanned yet. Scan your first product!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
