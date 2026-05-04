const express = require('express');
const axios = require('axios');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * GET /api/system/status
 * Check the status of external dependencies (e.g., Open Food Facts API)
 */
router.get('/status', async (req, res, next) => {
  try {
    // Ping Open Food Facts API with a fast timeout (3s) to see if it's responsive
    let isOffUp = false;
    try {
      // Use the generic search API with a simple query to test responsiveness
      await axios.get('https://world.openfoodfacts.org/cgi/search.pl?search_terms=test&search_simple=1&json=1&page_size=1', {
        timeout: 3000,
        headers: {
          'User-Agent': 'NutriScan/1.0 (https://github.com/nutriscan)',
        },
      });
      isOffUp = true;
    } catch (err) {
      logger.warn(`Open Food Facts API health check failed: ${err.message}`);
      isOffUp = false;
    }

    res.json({
      success: true,
      services: {
        database: 'up', // If they hit this route, DB middleware already passed
        openfoodfacts: isOffUp ? 'up' : 'down',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
