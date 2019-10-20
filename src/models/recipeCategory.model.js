import mongoose from 'mongoose';
const { Schema } = mongoose;

// Create Schema
const RecipeCategorySchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('RecipeCategory', RecipeCategorySchema);
