import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
dotenv.config();

export default async function auth(req, res, next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(!token) return res.status(401).json({ msg: 'No token' });
  try{
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if(!user) return res.status(401).json({ msg: 'User not found' });
    req.user = { id: user._id, role: user.role };
    next();
  }catch(err){
    return res.status(401).json({ msg: 'Token invalid' });
  }
}
