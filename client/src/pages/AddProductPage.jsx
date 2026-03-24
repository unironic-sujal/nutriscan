import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createProduct } from '../services/api';

const AddProductPage = () => {
  const { barcode } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    barcode: barcode || '',
    name: '',
    brand: '',
    serving_size: '100g',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    sugar: '',
    fiber: '',
    sodium: '',
    saturated_fat: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await createProduct(formData);
      if (response.success) {
        navigate(`/product/${formData.barcode}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page add-product-page">
      <div className="page-header">
        <h1 className="page-title">Add New Product</h1>
        <p className="page-subtitle">Help us grow our database!</p>
      </div>

      <div className="form-container">
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="add-product-form">
          {/* General Info */}
          <section className="glass-card">
            <h2 className="section-title"><span className="section-icon">📋</span> General Info</h2>
            
            <div className="form-group">
              <label htmlFor="barcode">Barcode</label>
              <input
                type="text"
                id="barcode"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                required
                className="manual-input w-full"
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Parle-G Original"
                className="manual-input w-full"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="brand">Brand Name</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Parle"
                className="manual-input w-full"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="serving_size">Serving Size</label>
              <input
                type="text"
                id="serving_size"
                name="serving_size"
                value={formData.serving_size}
                onChange={handleChange}
                placeholder="e.g. 100g, 1 biscuit (10g)"
                className="manual-input w-full"
              />
            </div>
          </section>

          {/* Nutrition Info */}
          <section className="glass-card">
            <h2 className="section-title"><span className="section-icon">📊</span> Nutrition (per 100g)</h2>
            <p className="section-help-text" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Enter values in grams (g) unless specified otherwise. Look at the back of the packet.
            </p>

            <div className="macro-input-grid">
              <div className="macro-input-card">
                <label className="macro-input-label" htmlFor="calories">
                  <span>🔥 Calories</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>kcal</span>
                </label>
                <input type="number" step="0.1" id="calories" name="calories" value={formData.calories} onChange={handleChange} className="manual-input w-full mt-2" placeholder="0" />
              </div>

              <div className="macro-input-card">
                <label className="macro-input-label" htmlFor="protein">
                  <span>💪 Protein</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>g</span>
                </label>
                <input type="number" step="0.1" id="protein" name="protein" value={formData.protein} onChange={handleChange} className="manual-input w-full mt-2" placeholder="0" />
              </div>

              <div className="macro-input-card">
                <label className="macro-input-label" htmlFor="carbs">
                  <span>🌾 Carbs</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>g</span>
                </label>
                <input type="number" step="0.1" id="carbs" name="carbs" value={formData.carbs} onChange={handleChange} className="manual-input w-full mt-2" placeholder="0" />
              </div>

              <div className="macro-input-card">
                <label className="macro-input-label" htmlFor="fat">
                  <span>🫧 Total Fat</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>g</span>
                </label>
                <input type="number" step="0.1" id="fat" name="fat" value={formData.fat} onChange={handleChange} className="manual-input w-full mt-2" placeholder="0" />
              </div>

              <div className="macro-input-card">
                <label className="macro-input-label" htmlFor="sugar">
                  <span>🍬 Sugar</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>g</span>
                </label>
                <input type="number" step="0.1" id="sugar" name="sugar" value={formData.sugar} onChange={handleChange} className="manual-input w-full mt-2" placeholder="0" />
              </div>

              <div className="macro-input-card">
                <label className="macro-input-label" htmlFor="saturated_fat">
                  <span>💧 Sat. Fat</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>g</span>
                </label>
                <input type="number" step="0.1" id="saturated_fat" name="saturated_fat" value={formData.saturated_fat} onChange={handleChange} className="manual-input w-full mt-2" placeholder="0" />
              </div>

              <div className="macro-input-card">
                <label className="macro-input-label" htmlFor="fiber">
                  <span>🌿 Fiber</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>g</span>
                </label>
                <input type="number" step="0.1" id="fiber" name="fiber" value={formData.fiber} onChange={handleChange} className="manual-input w-full mt-2" placeholder="0" />
              </div>

              <div className="macro-input-card">
                <label className="macro-input-label" htmlFor="sodium">
                  <span>🧂 Sodium</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>g</span>
                </label>
                <input type="number" step="0.001" id="sodium" name="sodium" value={formData.sodium} onChange={handleChange} className="manual-input w-full mt-2" placeholder="0" />
              </div>
            </div>
          </section>

          <div className="form-actions" style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              style={{ flex: 1 }}
              onClick={() => navigate('/scan')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ flex: 2 }}
              disabled={isSubmitting || !formData.name || !formData.barcode}
            >
              {isSubmitting ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
