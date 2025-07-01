const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');

// Middleware to ensure user is logged in
function ensureAuth(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

// Route to show product upload form (MUST come before `/:id`)
router.get('/new', ensureAuth, (req, res) => {
  res.render('products/new'); // Make sure views/products/new.ejs exists
});

// Handle product form submission
router.post('/', ensureAuth, async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    const newProduct = new Product({
      name,
      description,
      price,
      image,
      owner: req.session.userId
    });

    await newProduct.save();
    res.redirect('/dashboard'); // Or redirect to products list
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong while saving product');
  }
});

// View all products of the logged-in seller
router.get('/', ensureAuth, async (req, res) => {
  try {
    const products = await Product.find({ owner: req.session.userId });
    res.render('products/index', { products });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch products');
  }
});

// Show product detail (after /new to avoid "CastError")
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('owner');
    if (!product) return res.status(404).send('Product not found');

    res.render('products/show', { product });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to load product');
  }
});

module.exports = router;
