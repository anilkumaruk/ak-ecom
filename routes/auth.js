const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');


router.get('/', (req, res) => {
  res.redirect('/login'); // or render a homepage.ejs if you prefer
});

// Show login page
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// Show register page
router.get('/register', (req, res) => {
  res.render('auth/register');
});

// Handle registration
router.post('/register', async (req, res) => {
  const { email, password, storeName } = req.body;
  try {
    const user = new User({ email, password, storeName });
    await user.save();
    req.session.userId = user._id;
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.redirect('/register');
  }
});

// Handle login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && await user.comparePassword(password)) {
      req.session.userId = user._id;
      res.redirect('/dashboard');
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
    res.redirect('/login');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
