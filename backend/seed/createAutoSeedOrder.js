import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

dotenv.config();

const seedOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Change this to your login email
    const loginEmail = 'test@example.com';

    // 1. Find your logged-in user
    const user = await User.findOne({ email: loginEmail });
    if (!user) {
      console.log(`❌ No user found with email: ${loginEmail}`);
      process.exit(1);
    }

    // 2. Check if products exist, else create some
    let products = await Product.find();
    if (products.length === 0) {
      console.log('⚠️ No products found. Creating sample products...');
      const sampleProducts = [
        { name: 'Laptop', price: 999, description: 'High-performance laptop', countInStock: 10 },
        { name: 'Smartphone', price: 699, description: 'Latest smartphone model', countInStock: 15 },
        { name: 'Headphones', price: 199, description: 'Noise-cancelling headphones', countInStock: 20 }
      ];
      products = await Product.insertMany(sampleProducts);
      console.log('✅ Sample products created.');
    }

    // 3. Remove old orders for this user
    await Order.deleteMany({ user: user._id });

    // 4. Create new orders
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
    console.log(`✅ Orders seeded for user: ${loginEmail}`);

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedOrders();

