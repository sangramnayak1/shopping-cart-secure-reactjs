import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';

dotenv.config();

const router = express.Router();

function generateAccessToken(user){
  return jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET, { expiresIn: '15m' });
}
function generateRefreshToken(user){
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, { expiresIn: '7d' });
}

// Register
router.post('/register',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 8 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    try{
      const existing = await User.findOne({ email });
      if(existing) return res.status(400).json({ msg: 'User exists' });
      const user = new User({ name, email, password });
      await user.save();

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      user.refreshToken = refreshToken;
      await user.save();

      res.cookie('jid', refreshToken, { httpOnly: true, secure: false, path: '/api/auth/refresh', sameSite: 'lax' });
      res.json({ accessToken });
    }catch(err){
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

// Login
router.post('/login',
  [ body('email').isEmail(), body('password').notEmpty() ],
  async (req, res) => {
    console.log('Incoming login body:', req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    try{
      const user = await User.findOne({ email });
      if(!user) return res.status(400).json({ msg: 'Invalid credentials' });
      const isMatch = await user.comparePassword(password);
      if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      user.refreshToken = refreshToken;
      await user.save();

      res.cookie('jid', refreshToken, { httpOnly: true, secure: false, path: '/api/auth/refresh', sameSite: 'lax' });
      res.json({ accessToken });
    }catch(err){ console.error(err); res.status(500).send('Server error'); }
  }
);

// Refresh
router.post('/refresh', async (req, res) => {
  const token = req.cookies.jid;
  if(!token) return res.status(401).json({ msg: 'No token' });
  try{
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if(!user || user.refreshToken !== token) return res.status(401).json({ msg: 'Invalid token' });

    const newAccess = generateAccessToken(user);
    const newRefresh = generateRefreshToken(user);
    user.refreshToken = newRefresh;
    await user.save();

    res.cookie('jid', newRefresh, { httpOnly: true, secure: false, path: '/api/auth/refresh', sameSite: 'lax' });
    res.json({ accessToken: newAccess });
  }catch(err){ console.error(err); res.status(401).json({ msg: 'Token invalid' }); }
});

// Logout
router.post('/logout', async (req, res) => {
  const token = req.cookies.jid;
  if(token){
    try{
      const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
      await User.findByIdAndUpdate(payload.id, { $unset: { refreshToken: 1 } });
    }catch{};
  }
  res.clearCookie('jid', { path: '/api/auth/refresh' });
  res.json({ ok: true });
});

router.post('/logout', authMiddleware, async (req, res) => {
  try {
    const token = req.cookies?.jid;

    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(payload.userId);

        if (user) {
          user.refreshToken = null;
          await user.save();
        }
      } catch (err) {
        console.warn('Invalid or expired refresh token during logout');
      }
    }

    res.clearCookie('jid', {
      httpOnly: true,
      secure: false, // set true in production
      path: '/api/auth/refresh',
      sameSite: 'lax'
    });

    res.json({ msg: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
