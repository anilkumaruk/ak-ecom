// routes/store.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order'); // If you're tracking orders

// Seller Dashboard Page
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);

    // Fetch counts and recent data
    const totalProducts = await Product.countDocuments({ owner: user._id });
    const totalOrders = await Order.countDocuments({ seller: user._id }); // Optional
    const products = await Product.find({ owner: user._id })
                                  .sort({ createdAt: -1 })
                                  .limit(5);

    res.render('dashboard', {
      user,
      totalProducts,
      totalOrders,
      products
    });
  } catch (err) {
    console.error(err);
    res.redirect('/login');
  }
});

module.exports = router;
