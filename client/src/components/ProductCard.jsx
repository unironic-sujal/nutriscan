const NutritionCard = ({ label, value, unit, color, icon }) => {
  return (
    <div className="nutrition-card" style={{ '--accent-color': color }}>
      <div className="nutrition-card-icon">{icon}</div>
      <div className="nutrition-card-value">
        {value}
        <span className="nutrition-card-unit">{unit}</span>
      </div>
      <div className="nutrition-card-label">{label}</div>
    </div>
  );
};

const ProductCard = ({ product, onClick }) => {
  const { name, brand, image_url, nutrition } = product;

  return (
    <div className="product-card" onClick={onClick}>
      <div className="product-card-image">
        {image_url ? (
          <img src={image_url} alt={name} loading="lazy" />
        ) : (
          <div className="product-card-placeholder">📦</div>
        )}
      </div>
      <div className="product-card-info">
        <h3 className="product-card-name">{name}</h3>
        <p className="product-card-brand">{brand}</p>
        <div className="product-card-macros">
          <span className="macro-badge macro-calories">🔥 {nutrition.calories} kcal</span>
          <span className="macro-badge macro-protein">💪 {nutrition.protein}g P</span>
          <span className="macro-badge macro-carbs">🌾 {nutrition.carbs}g C</span>
          <span className="macro-badge macro-fat">🫧 {nutrition.fat}g F</span>
        </div>
      </div>
    </div>
  );
};

export { NutritionCard, ProductCard };
