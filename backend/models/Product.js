import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: Number,
  description: String,
  stock: { type: Number, default: 100 }
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);
