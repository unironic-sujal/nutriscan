const axios = require('axios');
const logger = require('../utils/logger');

const OPEN_FOOD_FACTS_API = 'https://world.openfoodfacts.org/api/v0/product';
const OPEN_FOOD_FACTS_SEARCH_API = 'https://world.openfoodfacts.org/cgi/search.pl';

/**
 * Fetch product data from Open Food Facts API by barcode
 * @param {string} barcode - EAN-13/EAN-8 barcode number
 * @returns {object|null} - Normalized product object or null if not found
 */
const fetchProduct = async (barcode) => {
  try {
    const response = await axios.get(`${OPEN_FOOD_FACTS_API}/${barcode}.json`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'NutriScan/1.0 (https://github.com/nutriscan)',
      },
    });

    const { data } = response;

    if (data.status !== 1 || !data.product) {
      logger.info(`Product not found on Open Food Facts: ${barcode}`);
      return null;
    }

    return normalizeProduct(barcode, data.product);
  } catch (error) {
    logger.error(`Open Food Facts API error for barcode ${barcode}: ${error.message}`);
    return null;
  }
};

/**
 * Search Open Food Facts API by query string
 * @param {string} query - Search term
 * @param {number} pageSize - Max results to return (default 10)
 * @returns {object[]} - Array of normalized product objects
 */
const searchOpenFoodFacts = async (query, pageSize = 10) => {
  try {
    const response = await axios.get(OPEN_FOOD_FACTS_SEARCH_API, {
      timeout: 10000,
      params: {
        search_terms: query,
        search_simple: 1,
        action: 'process',
        json: 1,
        page_size: pageSize,
        // Prefer products with images and nutrition data
        sort_by: 'unique_scans_n',
      },
      headers: {
        'User-Agent': 'NutriScan/1.0 (https://github.com/nutriscan)',
      },
    });

    const products = response.data?.products;
    if (!Array.isArray(products) || products.length === 0) {
      return [];
    }

    // Normalize and filter out products missing a barcode or name
    return products
      .filter((p) => p.code && (p.product_name || p.product_name_en))
      .map((p) => normalizeProduct(p.code, p));
  } catch (error) {
    logger.error(`Open Food Facts search error for "${query}": ${error.message}`);
    return [];
  }
};

/**
 * Normalize a raw Open Food Facts product object into our schema shape
 * @param {string} barcode
 * @param {object} product - Raw OFF product
 * @returns {object}
 */
const normalizeProduct = (barcode, product) => {
  const nutrients = product.nutriments || {};
  return {
    barcode,
    name: product.product_name || product.product_name_en || 'Unknown Product',
    brand: product.brands || 'Unknown',
    image_url: product.image_url || product.image_front_url || '',
    categories: product.categories || '',
    nutrition: {
      serving_size: product.serving_size || product.quantity || 'N/A',
      calories: Math.round(nutrients['energy-kcal_100g'] || nutrients['energy-kcal'] || 0),
      protein: Math.round((nutrients.proteins_100g || nutrients.proteins || 0) * 10) / 10,
      carbs: Math.round((nutrients.carbohydrates_100g || nutrients.carbohydrates || 0) * 10) / 10,
      fat: Math.round((nutrients.fat_100g || nutrients.fat || 0) * 10) / 10,
      sugar: Math.round((nutrients.sugars_100g || nutrients.sugars || 0) * 10) / 10,
      fiber: Math.round((nutrients.fiber_100g || nutrients.fiber || 0) * 10) / 10,
      sodium: Math.round((nutrients.sodium_100g || nutrients.sodium || 0) * 1000) / 1000,
      saturated_fat: Math.round((nutrients['saturated-fat_100g'] || nutrients['saturated-fat'] || 0) * 10) / 10,
    },
    source: 'openfoodfacts',
  };
};

module.exports = { fetchProduct, searchOpenFoodFacts };
