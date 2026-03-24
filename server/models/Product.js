const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
  serving_size: { type: String, default: 'N/A' },
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  sugar: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 },
  sodium: { type: Number, default: 0 },
  saturated_fat: { type: Number, default: 0 },
});

const productSchema = new mongoose.Schema(
  {
    barcode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      index: true,
    },
    brand: {
      type: String,
      default: 'Unknown',
    },
    image_url: {
      type: String,
      default: '',
    },
    nutrition: {
      type: nutritionSchema,
      required: true,
    },
    categories: {
      type: String,
      default: '',
    },
    source: {
      type: String,
      enum: ['openfoodfacts', 'manual'],
      default: 'openfoodfacts',
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search functionality
productSchema.index({ name: 'text', brand: 'text', categories: 'text' });

module.exports = mongoose.model('Product', productSchema);
