const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      qty: { type: Number, default: 1 }
    }
  ],
  amount: Number,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  status: { type: String, enum: ['new', 'processing', 'completed'], default: 'new' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);