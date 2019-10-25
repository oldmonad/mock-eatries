import uuid from 'uuid';
import RecipeCategory from '../models/recipeCategory.model';
import Recipe from '../models/recipe.model';
import User from '../models/user.model';

import {
  successResponse,
  excludeProperty,
  errorResponse,
  extractModelData,
} from '../utils/helpers';

// import client from '../db/redis';

/**
 * Create A recipe
 * @param {string} sentence
 * @returns {string} Joined words
 */
export function joinWords(sentence) {
  return sentence
    .split(' ')
    .slice(0, 2)
    .join('-')
    .toLowerCase();
}

/**
 * Create A recipe
 * @param {object} req
 * @param {object} res
 * @returns {object} recipe  object
 */
export async function createRecipe(req, res) {
  let { name, ingredients } = req.body;
  const { categoryId } = req.params;

  const slug = `${joinWords(name)}-${uuid.v4()}`;

  let { _id } = req.user;

  _id = await extractModelData(User, _id.toString());

  const categoryExists = await RecipeCategory.findOne({ _id: categoryId });
  if (!categoryExists) {
    return errorResponse(res, 404, 'This category does not exist');
  }

  const newRecipe = new Recipe({
    createdBy: _id,
    category: categoryId,
    name,
    slug,
    ingredients,
  });

  const recipe = await newRecipe.save();

  const recipeJSON = recipe.toJSON();

  const creatededRecipe = excludeProperty(recipeJSON, ['__v', 'date']);
  successResponse(res, 201, 'Recipe created', creatededRecipe);
}

/**
 * Create A recipe
 * @param {object} req
 * @param {object} res
 * @returns {object} recipe object
 */
export async function editRecipe(req, res) {
  const { name, ingredients } = req.body;
  const { categoryId, recipeId } = req.params;
  const { _id } = req.user;

  const categoryExists = await RecipeCategory.findOne({ _id: categoryId });
  if (!categoryExists) {
    return errorResponse(res, 404, 'This category does not exist');
  }

  const recipeExists = await Recipe.findOne({ _id: recipeId });
  if (!recipeExists) {
    return errorResponse(res, 404, 'This recipe does not exist');
  }

  // if (_id.toString() !== recipeExists.createdBy.toString()) {
  //   return errorResponse(
  //     res,
  //     401,
  //     'You cannot update a recipe you did not create',
  //   );
  // }

  const updatedRecipe = await Recipe.findOneAndUpdate(
    { _id: recipeId },
    { name, ingredients },
    { new: true },
  );

  const updatedRecipeJSON = updatedRecipe.toJSON();

  const updatedRecipeData = excludeProperty(updatedRecipeJSON, ['__v', 'date']);

  return successResponse(
    res,
    200,
    'Recipe has been updated',
    updatedRecipeData,
  );
}

/**
 * Create A recipe
 * @param {object} req
 * @param {object} res
 * @returns {object} recipe object
 */
export async function deleteRecipe(req, res) {
  const { categoryId, recipeId } = req.params;
  const { _id } = req.user;

  const categoryExists = await RecipeCategory.findOne({ _id: categoryId });
  if (!categoryExists) {
    return errorResponse(res, 404, 'This category does not exist');
  }

  const recipeExists = await Recipe.findOne({ _id: recipeId });
  if (!recipeExists) {
    return errorResponse(res, 404, 'This recipe does not exist');
  }

  // if (_id.toString() !== recipeExists.createdBy.toString()) {
  //   return errorResponse(
  //     res,
  //     401,
  //     'You cannot delete a recipe you did not create',
  //   );
  // }

  await Recipe.findOneAndDelete({
    _id: recipeId,
  });

  return successResponse(res, 201, 'Recipe has been deleted', null);
}

/**
 * Create A recipe
 * @param {object} req
 * @param {object} res
 * @returns {object} recipe object
 */
export async function getRecipe(req, res) {
  const { categoryId, recipeId } = req.params;

  const categoryExists = await RecipeCategory.findOne({ _id: categoryId });
  if (!categoryExists) {
    return errorResponse(res, 404, 'This category does not exist');
  }

  const recipeExists = await Recipe.findOne({ _id: recipeId });
  if (!recipeExists) {
    return errorResponse(res, 404, 'This recipe does not exist');
  }

  return successResponse(res, 200, 'Recipe', recipeExists);
}
