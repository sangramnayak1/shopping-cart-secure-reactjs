import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
dotenv.config();
const mongo = process.env.MONGO_URI || 'mongodb://mongo:27017/shopping';

async function run(){
  await mongoose.connect(mongo);
  try{
    const cnt = await Product.countDocuments();
    if(cnt>0){ console.log('Products exist, skipping'); return; }
    await Product.insertMany([
      { name: 'Laptop', price: 999.99, description: 'High-performance laptop' },
      { name: 'Headphones', price: 199.99, description: 'Noise cancelling headphones' },
      { name: 'Smartphone', price: 699.99, description: 'Latest model smartphone' }
    ]);
    console.log('Products seeded');
  }catch(e){ console.error(e); }finally{ await mongoose.disconnect(); }
}
run();
