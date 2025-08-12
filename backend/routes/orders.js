import express from 'express';
import auth from '../middleware/auth.js';
import Order from '../models/Order.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    let orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('orderItems.product', 'name price');

    orders = orders.map(order => {
      const totalPrice = order.orderItems.reduce((sum, item) => {
        const price = item.product?.price || 0;
        return sum + price * item.qty;
      }, 0);
      return {
        ...order.toObject(),
        totalPrice
      };
    });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/:id', auth, async (req, res) => {
  try{
    const order = await Order.findById(req.params.id).populate('orderItems.product');
    if(!order) return res.status(404).json({ msg: 'Not found' });
    if(order.user.toString() !== req.user.id) return res.status(403).json({ msg: 'Forbidden' });
    res.json(order);
  }catch(err){ res.status(500).json({ msg: 'Server error' }); }
});

router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ msg: 'Order not found' });

    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ msg: 'Order not found' });

    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


export default router;
