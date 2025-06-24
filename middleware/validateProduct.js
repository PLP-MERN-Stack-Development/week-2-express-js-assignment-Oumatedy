// middleware/validateProduct.js

const { ValidationError } = require('../utils/errors');

module.exports = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;

  if (!name || typeof name !== 'string') {
    throw new ValidationError('Product name is required and must be a string.');
  }

  if (!description || typeof description !== 'string') {
    throw new ValidationError('Product description is required and must be a string.');
  }

  if (typeof price !== 'number' || price < 0) {
    throw new ValidationError('Product price must be a non-negative number.');
  }

  if (!category || typeof category !== 'string') {
    throw new ValidationError('Product category is required and must be a string.');
  }

  if (typeof inStock !== 'boolean') {
    throw new ValidationError('Product inStock must be a boolean.');
  }

  next();
};
