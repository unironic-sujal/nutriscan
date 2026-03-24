import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NutritionCard } from '../components/ProductCard';
import { getProductByBarcode } from '../services/api';

const ProductPage = () => {
  const { barcode } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProductByBarcode(barcode);
        if (response.success) {
          setProduct(response.data);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Product not found. This barcode is not in our database yet.');
        } else if (err.response?.status === 400) {
          setError('Invalid barcode format.');
        } else {
          setError('Failed to fetch product. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [barcode]);

  if (loading) {
    return (
      <div className="page product-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Fetching nutrition data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const isNotFound = error.includes('not in our database');

    return (
      <div className="page product-page">
        <div className="error-state">
          <div className="error-state-icon">😕</div>
          <h2>Oops!</h2>
          <p>{error}</p>
          <div className="error-actions">
            {isNotFound && (
              <button className="btn btn-primary" onClick={() => navigate(`/add/${barcode}`)}>
                Add Product Manually
              </button>
            )}
            <button className={isNotFound ? "btn btn-secondary" : "btn btn-primary"} onClick={() => navigate('/scan')}>
              Try Another Scan
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    // If we finished loading, have no errors, but also no product data (unexpected state)
    // Avoid a crash by returning the blank state or a safe error message.
    return (
      <div className="page product-page">
        <div className="error-state">
          <div className="error-state-icon">😕</div>
          <h2>Oops!</h2>
          <p>Something went wrong loading this product.</p>
          <div className="error-actions">
            <button className="btn btn-primary" onClick={() => navigate('/scan')}>
              Scan Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  const nutrition = product.nutrition || {};

  const macros = [
    { label: 'Calories', value: nutrition.calories || 0, unit: 'kcal', color: '#ff6b6b', icon: '🔥' },
    { label: 'Protein', value: nutrition.protein || 0, unit: 'g', color: '#51cf66', icon: '💪' },
    { label: 'Carbs', value: nutrition.carbs || 0, unit: 'g', color: '#ffd43b', icon: '🌾' },
    { label: 'Fat', value: nutrition.fat || 0, unit: 'g', color: '#ff922b', icon: '🫧' },
    { label: 'Sugar', value: nutrition.sugar || 0, unit: 'g', color: '#e599f7', icon: '🍬' },
    { label: 'Fiber', value: nutrition.fiber || 0, unit: 'g', color: '#69db7c', icon: '🌿' },
    { label: 'Sodium', value: nutrition.sodium || 0, unit: 'g', color: '#74c0fc', icon: '🧂' },
    { label: 'Sat. Fat', value: nutrition.saturated_fat || 0, unit: 'g', color: '#ffa94d', icon: '💧' },
  ];

  return (
    <div className="page product-page">
      {/* Product Header */}
      <div className="product-header">
        <div className="product-image-container">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="product-image" />
          ) : (
            <div className="product-image-placeholder">📦</div>
          )}
        </div>
        <div className="product-info">
          <span className="product-brand-badge">{product.brand}</span>
          <h1 className="product-name">{product.name}</h1>
          <div className="product-meta">
            <span className="meta-item">📊 Per {nutrition.serving_size}</span>
            <span className="meta-item">🏷️ {product.barcode}</span>
          </div>
        </div>
      </div>

      {/* Nutrition Grid */}
      <section className="section">
        <h2 className="section-title">
          <span className="section-icon">📊</span>
          Nutritional Information
          <span className="section-subtitle">per 100g</span>
        </h2>

        <div className="nutrition-grid">
          {macros.map((macro) => (
            <NutritionCard key={macro.label} {...macro} />
          ))}
        </div>
      </section>

      {/* Actions */}
      <div className="product-actions">
        <button className="btn btn-primary" onClick={() => navigate('/scan')}>
          <span className="btn-icon">📷</span>
          Scan Another
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          <span className="btn-icon">🏠</span>
          Home
        </button>
      </div>
    </div>
  );
};

export default ProductPage;
