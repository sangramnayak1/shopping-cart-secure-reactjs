import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const seedOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const user = await User.findOne(); // Just pick the first user
    const products = await Product.find();

    if (!user || products.length === 0) {
      console.log('❌ No user or products found. Seed them first.');
      process.exit(1);
    }

    // Example: create 2 orders
    const ordersData = [
      {
        user: user._id,
        orderItems: [
          { product: products[0]._id, qty: 2 },
          { product: products[1]._id, qty: 1 }
        ]
      },
      {
        user: user._id,
        orderItems: [
          { product: products[2]._id, qty: 3 }
        ]
      }
    ];

    // Calculate totalPrice for each order
    for (let order of ordersData) {
      // Populate product prices
      const populatedItems = await Promise.all(
        order.orderItems.map(async item => {
          const product = await Product.findById(item.product);
          return { ...item, price: product.price };
        })
      );

      order.totalPrice = populatedItems.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      );
    }

    await Order.deleteMany();
    const createdOrders = await Order.insertMany(ordersData);

    console.log(`✅ Seeded ${createdOrders.length} orders`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedOrders();

