// middleware/auth.js

module.exports = (req, res, next) => {
  // Simulated authentication check
  const apiKey = req.headers['x-api-key'];

  // You can set your own API key for dev/testing
  if (!apiKey || apiKey !== 'my-secret-key') {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });
  }

  // If valid, allow request through
  next();
};
