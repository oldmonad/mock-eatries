import mongoose from 'mongoose';
const { Schema } = mongoose;

// Create Schema
const CartSchema = new Schema({
  createdBy: {
    type: Schema.Types.Mixed,
    ref: 'users',
  },
  cart: {
    type: Array,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Cart', CartSchema);
