const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');

// Route: /store/:storeName
router.get('/:storeName', async (req, res) => {
  try {
    const store = await User.findOne({ storeName: req.params.storeName });
    if (!store) return res.status(404).send('Store not found');

    const products = await Product.find({ owner: store._id });

    res.render('storefront', { store, products });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
