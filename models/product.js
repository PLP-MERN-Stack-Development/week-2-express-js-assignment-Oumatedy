const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


const ProductSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price must be a positive number'],
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});


const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
