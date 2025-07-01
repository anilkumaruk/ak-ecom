const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Razorpay = require('razorpay');
const shortid = require('shortid');

// Razorpay setup
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Show all orders
router.get('/', async (req, res) => {
  const orders = await Order.find({ owner: req.session.userId }).populate('products.product');
  res.render('orders', { orders });
});

// Create Razorpay order
router.post('/create', async (req, res) => {
  const { amount } = req.body;
  const options = {
    amount: amount * 100,
    currency: 'INR',
    receipt: shortid.generate()
  };
  const order = await razorpay.orders.create(options);
  res.json(order);
});

module.exports = router;
