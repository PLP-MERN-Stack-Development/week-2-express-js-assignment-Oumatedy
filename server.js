// server.js - Enhanced Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { NotFoundError, ValidationError } = require('./utils/errors');
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');
const validateProduct = require('./middleware/validateProduct');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// In-memory products array
let products = [];

// Middleware setup
app.use(logger);
app.use(bodyParser.json());
app.use(auth);

// Ignore favicon.ico requests to reduce noise
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Root route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// GET /api/products - List all products with optional filtering & pagination
app.get('/api/products', (req, res, next) => {
  try {
    let { category, page = 1, limit = 10 } = req.query;
    let result = [...products];

    // Filtering by category (case-insensitive)
    if (category) {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Pagination
    page = parseInt(page);
    limit = parseInt(limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = result.slice(start, end);

    res.json({
      total: result.length,
      page,
      limit,
      products: paginated
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id - Get product by ID
app.get('/api/products/:id', (req, res, next) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) throw new NotFoundError('Product not found');
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST /api/products - Create new product
app.post('/api/products', validateProduct, (req, res, next) => {
  try {
    const { name, description, price, category, inStock } = req.body;
    const newProduct = {
      id: uuidv4(),
      name,
      description,
      price,
      category,
      inStock,
      createdAt: new Date().toISOString()
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id - Update product
app.put('/api/products/:id', validateProduct, (req, res, next) => {
  try {
    const idx = products.findIndex(p => p.id === req.params.id);
    if (idx === -1) throw new NotFoundError('Product not found');
    products[idx] = { ...products[idx], ...req.body };
    res.json(products[idx]);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id - Delete product
app.delete('/api/products/:id', (req, res, next) => {
  try {
    const idx = products.findIndex(p => p.id === req.params.id);
    if (idx === -1) throw new NotFoundError('Product not found');
    const deleted = products.splice(idx, 1);
    res.json(deleted[0]);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/search?name= - Search products by name (case-insensitive)
app.get('/api/products/search', (req, res, next) => {
  try {
    const { name } = req.query;
    if (!name) throw new ValidationError('Name query parameter is required');
    const result = products.filter(p =>
      p.name.toLowerCase().includes(name.toLowerCase())
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/stats - Product statistics (count by category)
app.get('/api/products/stats', (req, res, next) => {
  try {
    const stats = {};
    products.forEach(p => {
      const category = p.category.toLowerCase();
      stats[category] = (stats[category] || 0) + 1;
    });
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

// Global error handler
app.use(require('./middleware/errorHandler'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing
module.exports = app;
