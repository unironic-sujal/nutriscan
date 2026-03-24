const express = require('express');
const Product = require('../models/Product');
const { fetchProduct } = require('../services/openFoodFacts');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * GET /api/product/:barcode
 * Look up a product by barcode.
 * First checks our database, then falls back to Open Food Facts API.
 */
router.get('/product/:barcode', async (req, res, next) => {
  try {
    const { barcode } = req.params;

    // Validate barcode format (EAN-8 or EAN-13)
    if (!/^\d{8,13}$/.test(barcode)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid barcode format. Must be 8-13 digits.',
      });
    }

    // Step 1: Check our database
    let product = await Product.findOne({ barcode });

    if (product) {
      logger.info(`Product found in database: ${barcode}`);
      return res.json({ success: true, source: 'database', data: product });
    }

    // Step 2: Fetch from Open Food Facts API
    logger.info(`Product not in database, fetching from Open Food Facts: ${barcode}`);
    const productData = await fetchProduct(barcode);

    if (!productData) {
      return res.status(404).json({
        success: false,
        error: 'Product not found. This product is not in our database or Open Food Facts.',
      });
    }

    // Step 3: Save to our database for future lookups
    product = await Product.create(productData);
    logger.info(`Product saved to database: ${barcode} - ${product.name}`);

    return res.status(201).json({ success: true, source: 'openfoodfacts', data: product });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/search?q=query
 * Search products in our database by name, brand, or category.
 */
router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search query must be at least 2 characters.',
      });
    }

    const products = await Product.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(20)
      .lean();

    return res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/products/recent
 * Get recently added products.
 */
router.get('/products/recent', async (req, res, next) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
