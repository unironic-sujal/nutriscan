/**
 * API Key middleware for protected routes.
 * Expects the header: X-API-Key: <value of API_SECRET in .env>
 */
const requireApiKey = (req, res, next) => {
  const secret = process.env.API_SECRET;

  // If no secret is configured in env, block the route entirely
  if (!secret) {
    return res.status(503).json({
      success: false,
      error: 'Manual product submission is not configured on this server.',
    });
  }

  const providedKey = req.headers['x-api-key'];

  if (!providedKey || providedKey !== secret) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized. A valid X-API-Key header is required.',
    });
  }

  next();
};

module.exports = { requireApiKey };
