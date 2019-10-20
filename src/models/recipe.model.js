import mongoose from 'mongoose';
const { Schema } = mongoose;

// Create Schema
const RecipeSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'recipecategories',
  },
  name: {
    type: String,
    required: true,
  },
  ingredients: {
    type: Array,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Recipe', RecipeSchema);
