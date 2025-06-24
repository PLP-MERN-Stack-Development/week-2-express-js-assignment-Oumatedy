// db.js
const mongoose = require('mongoose');
require('dotenv').config();

// Replace with your actual connection string or use environment variable
const MONGO_URI = process.env.MONGO_URI;

// Options for the connection (optional, but recommended)
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, options);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
