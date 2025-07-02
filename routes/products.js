const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { validateProduct } = require('../middleware/validation');
const NotFoundError = require('../errors/NotFoundError');

const router = express.Router();

// In-memory storage for products (replace with a database in production)
let products = [];

// GET /api/products - List all products
router.get('/', (req, res) => {
 const { category, page = 1, limit = 10, search } = req.query;

 let filteredProducts = products;

 // Filter by category
 if (category) {
 filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
 }

 // Search by name
 if (search) {
 filteredProducts = filteredProducts.filter(p => 
 p.name.toLowerCase().includes(search.toLowerCase())
 );
 }

 // Pagination
 const startIndex = (page - 1) * limit;
 const endIndex = page * limit;
 const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

 res.json({
 total: filteredProducts.length,
 page: parseInt(page),
 limit: parseInt(limit),
 products: paginatedProducts
 });
});

// GET /api/products/:id - Get a specific product
router.get('/:id', (req, res, next) => {
 const product = products.find(p => p.id === req.params.id);
 if (!product) {
 return next(new NotFoundError('Product not found'));
 }
 res.json(product);
});

// POST /api/products - Create a new product
router.post('/', validateProduct, (req, res) => {
 const product = {
 id: uuidv4(),
 name: req.body.name,
 description: req.body.description,
 price: req.body.price,
 category: req.body.category,
 inStock: req.body.inStock
 };
 products.push(product);
 res.status(201).json(product);
});

// PUT /api/products/:id - Update a product
router.put('/:id', validateProduct, (req, res, next) => {
 const index = products.findIndex(p => p.id === req.params.id);
 if (index === -1) {
 return next(new NotFoundError('Product not found'));
 }
 products[index] = {
 ...products[index],
 ...req.body,
 id: req.params.id
 };
 res.json(products[index]);
});

// DELETE /api/products/:id - Delete a product
router.delete('/:id', (req, res, next) => {
 const index = products.findIndex(p => p.id === req.params.id);
 if (index === -1) {
 return next(new NotFoundError('Product not found'));
 }
 products = products.filter(p => p.id !== req.params.id);
 res.status(204).send();
});

// GET /api/products/stats - Get product statistics
router.get('/stats', (req, res) => {
 const stats = products.reduce((acc, product) => {
 acc[product.category] = (acc[product.category] || 0) + 1;
 return acc;
 }, {});
 res.json({ categoryCounts: stats });
});

module.exports = router;