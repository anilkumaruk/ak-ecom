const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session); // v3.2.0
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const path = require('path');
const os = require('os');

dotenv.config();
const app = express();

// 🔌 MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// 🔐 Session Setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'yoursecret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    url: process.env.MONGO_URI,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}));

// 📦 Middleware
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// 🧩 EJS Layouts
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('layout', 'layout'); // views/layout.ejs

// 🛣️ Routes
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

// 🚀 Start Server with Network IP shown
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  const interfaces = os.networkInterfaces();
  let networkIp = 'Not available';

  for (let iface of Object.values(interfaces)) {
    for (let config of iface) {
      if (config.family === 'IPv4' && !config.internal) {
        networkIp = config.address;
      }
    }
  }

  console.log(`\n✅ Server started successfully:`);
  console.log(`   → Local:   http://localhost:${PORT}`);
  console.log(`   → Network: http://${networkIp}:${PORT}\n`);
});
