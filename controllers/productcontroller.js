const Product = require('../models/Product');
const {
  validateProductInput,
  validateProductUpdateInput,
  buildQueryFilters,
} = require('../utils/productsUtils');


exports.createProduct = async (req, res) => {
  try {
    const { error } = validateProductInput(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getAllProducts = async (req, res) => {
  try {
    const { filter, search, pagination } = buildQueryFilters(req.query);

    const query = Product.find(filter).find(search);

    const total = await Product.countDocuments(query);
    const products = await query
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort({ createdAt: -1 });

    res.json({
      total,
      page: pagination.page,
      limit: pagination.limit,
      data: products,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.updateProduct = async (req, res) => {
  try {
    const { error } = validateProductUpdateInput(req.body, true);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );

    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
