import express from 'express';
import Product from '../models/Product.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const p = await Product.findById(req.params.id);
  if(!p) return res.status(404).json({ msg: 'Not found' });
  res.json(p);
});

// protected create (admin)
router.post('/', auth, async (req, res) => {
  if(req.user?.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
  const p = new Product(req.body);
  await p.save();
  res.status(201).json(p);
});

export default router;
