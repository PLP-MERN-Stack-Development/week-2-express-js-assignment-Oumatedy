// server.js - Enhanced Express server for Week 2 assignment

// Import required modules
const express = require('express');
const connectMongoDB = require('./config/db');
const bodyParser = require('body-parser');
const logger = require('./middleware/logger');


// Initialize Express app / App setup
const app = express();
connectMongoDB(); 
const PORT = process.env.PORT || 3000;

// In-memory products array
let products = [];

// Middleware setup
app.use(logger);
app.use(bodyParser.json());
// app.use(auth);

// Ignore favicon.ico requests to reduce noise
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Root route
app.get('/', (req, res) => {
  res.send('Hello World');
});
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/users', require('./routes/user.routes'));
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing
module.exports = app;
