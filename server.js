// ✅ Full updated server.js with session fix (for connect-mongo@3.2.0)

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Session setup using connect-mongo v3.2.0
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    url: process.env.MONGO_URI,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}));

// Middleware
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('layout', 'layout');      // tells it to use views/layout.ejs

// Routes
const authRoutes = require('./routes/auth');
const storeRoutes = require('./routes/store');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const settingsRoutes = require('./routes/settings');
const storefrontRoutes = require('./routes/storefront');

app.use('/', authRoutes);
app.use('/store', storeRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/settings', settingsRoutes);
app.use('/store', storefrontRoutes);
app.use('/dashboard', storeRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));