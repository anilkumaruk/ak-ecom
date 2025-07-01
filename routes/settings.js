const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Settings page
router.get('/', async (req, res) => {
  const user = await User.findById(req.session.userId);
  res.render('settings', { user });
});

// Update store info
router.post('/', async (req, res) => {
  const { storeName, storeDescription, contactInfo } = req.body;
  await User.findByIdAndUpdate(req.session.userId, {
    storeName,
    storeDescription,
    contactInfo
  });
  res.redirect('/settings');
});

module.exports = router;
