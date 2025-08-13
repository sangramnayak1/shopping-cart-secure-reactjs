const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      qty: { type: Number, required: true }
    }
  ],
  totalPrice: { type: Number, default: 0 }, // 👈 added
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  createdAt: { type: Date, default: Date.now }
});

// Calculate totalPrice before saving
orderSchema.pre('save', async function (next) {
  if (!this.isModified('orderItems')) return next();

  try {
    await this.populate('orderItems.product', 'price'); // populate only price
    this.totalPrice = this.orderItems.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.qty;
    }, 0);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Order', orderSchema);

