import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import connectDB from '../config/db.js';

const seedAdmin = async () => {
  await connectDB();

  const adminEmail = 'admin@example.com';
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin User',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    });
    console.log('✅ Admin created');
  } else {
    console.log('ℹ️ Admin already exists');
  }
  mongoose.connection.close();
};

seedAdmin();
