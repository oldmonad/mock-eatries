import RecipeCategory from '../models/recipeCategory.model';
import Recipe from '../models/recipe.model';
import { successResponse, errorResponse, escapeRegex } from '../utils/helpers';

/**
 * Add recipe to cart
 * @param {object} req
 * @param {object} res
 * @returns {object} recipeCategory and recipe object
 */
export async function search(req, res) {
  const { searchInput } = req.query;

  const responseObject = {};
  const input = new RegExp(escapeRegex(searchInput), 'gi');
  console.log(input);

  await RecipeCategory.find(
    { category: { $regex: input } },
    { _id: 0, __v: 0 },
    (err, data) => {
      if (err) {
        return errorResponse(res, 400, 'Something bad happened');
      }

      responseObject.recipeCategory = data;
    },
  );

  await Recipe.find(
    { name: { $regex: input } },
    { _id: 0, __v: 0 },
    (err, data) => {
      if (err) {
        return errorResponse(res, 400, 'Something bad happened');
      }

      responseObject.recipe = data;
    },
  );

  return successResponse(res, 200, 'Found', responseObject);
}
