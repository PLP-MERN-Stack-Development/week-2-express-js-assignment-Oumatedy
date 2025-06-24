const express = require('express');
const router = express.Router();
const productController = require('../controllers/productcontroller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware, productController.createProduct);
router.get('/', authMiddleware, productController.getAllProducts);
router.get('/:id', authMiddleware, productController.getProductById);
router.put('/:id', authMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;
