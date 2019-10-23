// import RecipeCategory from '../models/recipeCategory.model';
import Recipe from '../models/recipe.model';
import User from '../models/user.model';
import Cart from '../models/cart.model';
import {
  successResponse,
  // excludeProperty,
  // errorResponse,
  validateRecipes,
  pruneCart,
  extractModelData,
} from '../utils/helpers';
import { type } from 'os';

// import client from '../db/redis';

/**
 * Add recipe to cart
 * @param {object} req
 * @param {object} res
 * @returns {object} cart object
 */
export async function addRecipeToCart(req, res) {
  const { recipes } = req.body;
  const { _id } = req.user;

  const validRecipes = await validateRecipes(recipes);

  const userCart = await Cart.findOne({ createdBy: _id });

  if (userCart) {
    const cart = await pruneCart(validRecipes, _id, userCart.cart);

    const updatedCart = await Cart.findOneAndUpdate(
      { createdBy: _id },
      { cart },
      { new: true },
    );

    updatedCart.cart = await extractModelData(Recipe, updatedCart.cart);
    updatedCart.createdBy = await extractModelData(User, _id.toString());

    return successResponse(res, 201, 'Recipe added to cart', updatedCart);
  } else {
    const cart = new Cart({
      createdBy: _id,
      cart: recipes,
    });

    const createdCart = await cart.save();
    createdCart.cart = await extractModelData(Recipe, createdCart.cart);
    createdCart.createdBy = await extractModelData(User, _id.toString());

    return successResponse(res, 200, 'Recipe added to cart', createdCart);
  }
}
