import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/me', auth, async (req, res) => {
  try{
    const user = await User.findById(req.user.id).select('-password -refreshToken');
    res.json(user);
  }catch(err){ res.status(500).send('Server error'); }
});

router.put('/me', auth, async (req, res) => {
  try{
    const updates = (({ name, address, phone }) => ({ name, address, phone }))(req.body);
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password -refreshToken');
    res.json(user);
  }catch(err){ res.status(500).send('Server error'); }
});

export default router;
