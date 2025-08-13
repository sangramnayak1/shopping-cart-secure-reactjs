import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

dotenv.config();

const seedOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Change this to the email you use to log in
    const loginEmail = 'test@example.com';

    // Find the logged-in user in DB
    const user = await User.findOne({ email: loginEmail });
    if (!user) {
      console.log(`❌ No user found with email: ${loginEmail}`);
      process.exit(1);
    }

    const products = await Product.find();
    if (products.length === 0) {
      console.log('❌ No products found. Please seed products first.');
      process.exit(1);
    }

    // Clear existing orders for this user (optional)
    await Order.deleteMany({ user: user._id });

    const orders = [
      {
        user: user._id,
        orderItems: [
          { product: products[0]._id, qty: 2 },
          { product: products[1]._id, qty: 1 }
        ],
        status: 'Pending'
      },
      {
        user: user._id,
        orderItems: [
          { product: products[2]._id, qty: 1 }
        ],
        status: 'Shipped'
      }
    ];

    await Order.insertMany(orders);
    console.log(`✅ Orders seeded for user ${loginEmail}`);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedOrders();
