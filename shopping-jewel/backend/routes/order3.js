import express from 'express';
import auth from '../middleware/auth.js';
import Order from '../models/Order.js';

const router = express.Router();

// GET all orders for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'orderItems.product',
        select: 'name price' // Only send necessary fields
      });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: 'orderItems.product',
        select: 'name price'
      });

    if (!order) return res.status(404).json({ msg: 'Not found' });
    if (order.user.toString() !== req.user.id)
      return res.status(403).json({ msg: 'Forbidden' });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;

