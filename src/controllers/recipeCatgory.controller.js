import RecipeCategory from '../models/recipeCategory.model';
import User from '../models/user.model';
import {
  successResponse,
  excludeProperty,
  errorResponse,
  extractModelData,
} from '../utils/helpers';

import client from '../db/redis';

/**
 * Create A recipe category
 * @param {object} req
 * @param {object} res
 * @returns {object} recipe category object
 */
export async function createRecipeCategory(req, res) {
  const { category, description } = req.body;
  let { _id } = req.user;

  _id = await extractModelData(User, _id.toString());

  const newRecipeCategory = new RecipeCategory({
    createdBy: _id,
    category,
    description,
  });
  const categories = await newRecipeCategory.save();

  const categoryJSON = categories.toJSON();

  const creatededCategories = excludeProperty(categoryJSON, ['__v', 'date']);

  const allCategories = await RecipeCategory.find({}, { __v: 0 });

  client.get('recipe-categories', (error, recipeCategories) => {
    if (error) {
      return errorResponse(res, 400, 'Something went wrong');
    }
    if (recipeCategories) {
      client.del('recipe-categories');
      client.setex('recipe-categories', 3600, JSON.stringify(allCategories));
    } else {
      client.setex('recipe-categories', 3600, JSON.stringify(allCategories));
    }
  });

  successResponse(res, 201, 'Recipe category created', creatededCategories);
}

/**
 * Create A recipe category
 * @param {object} req
 * @param {object} res
 * @returns {object} recipe category object
 */
export async function editRecipeCategory(req, res) {
  const { category, description } = req.body;
  const { categoryId } = req.params;

  const categoryExists = await RecipeCategory.findOne({ _id: categoryId });
  if (!categoryExists) {
    return errorResponse(res, 404, 'This category does not exist');
  }

  const updatedCategory = await RecipeCategory.findOneAndUpdate(
    { _id: categoryId },
    { category, description },
    { new: true },
  );

  const updatedCategoryJSON = updatedCategory.toJSON();

  const updatedCategoryData = excludeProperty(updatedCategoryJSON, [
    '__v',
    'date',
  ]);

  const allCategories = await RecipeCategory.find({}, { __v: 0 });

  client.get('recipe-categories', (error, recipeCategories) => {
    if (error) {
      return errorResponse(res, 400, 'Something went wrong');
    }
    if (recipeCategories) {
      client.del('recipe-categories');
      client.setex('recipe-categories', 3600, JSON.stringify(allCategories));
    } else {
      client.setex('recipe-categories', 3600, JSON.stringify(allCategories));
    }
  });

  return successResponse(
    res,
    200,
    'Recipe category has been updated',
    updatedCategoryData,
  );
}

/**
 * Create A recipe category
 * @param {object} req
 * @param {object} res
 * @returns {object} recipe category object
 */
export async function deleteRecipeCategory(req, res) {
  const { categoryId } = req.params;
  const categoryExists = await RecipeCategory.findOne({ _id: categoryId });
  if (!categoryExists) {
    return errorResponse(res, 404, 'This category does not exist');
  }
  await RecipeCategory.findOneAndDelete({
    _id: categoryId,
  });

  const allCategories = await RecipeCategory.find({}, { __v: 0 });

  client.get('recipe-categories', (error, recipeCategories) => {
    if (error) {
      return errorResponse(res, 400, 'Something went wrong');
    }
    if (recipeCategories) {
      client.del('recipe-categories');
      client.setex('recipe-categories', 3600, JSON.stringify(allCategories));
    } else {
      client.setex('recipe-categories', 3600, JSON.stringify(allCategories));
    }
  });
  return successResponse(res, 200, 'Recipe category has been deleted', null);
}

/**
 * Create A recipe category
 * @param {object} req
 * @param {object} res
 * @returns {object} recipe category object
 */
export async function getRecipeCategory(req, res) {
  const { categoryId } = req.params;
  client.get('recipe-categories', async (error, recipeCategories) => {
    if (error) {
      return errorResponse(res, 400, 'Something went wrong');
    }

    if (recipeCategories) {
      const categoriesData = JSON.parse(recipeCategories);
      if (categoriesData.length === 0) {
        return errorResponse(res, 404, 'This category does not exist');
      }
      const foundCategory = categoriesData.find(category => {
        return category._id === categoryId;
      });

      if (!foundCategory) {
        return errorResponse(res, 404, 'This category does not exist');
      }

      return successResponse(res, 200, 'Recipe Category', foundCategory);
    } else {
      const categoryExists = await RecipeCategory.findOne(
        { _id: categoryId },
        { __v: 0 },
      );
      if (!categoryExists) {
        return errorResponse(res, 404, 'This category does not exist');
      }
      const categoriesFromDb = await RecipeCategory.find({}, { __v: 0 });
      client.setex('recipe-categories', 3600, JSON.stringify(categoriesFromDb));
      return successResponse(res, 200, 'Recipe Category', categoryExists);
    }
  });
}

/**
 * Create A recipe category
 * @param {object} req
 * @param {object} res
 * @returns {object} recipe category object
 */
export async function getRecipeCategories(req, res) {
  client.get('recipe-categories', async (error, recipeCategories) => {
    if (error) {
      return errorResponse(res, 400, 'Something went wrong');
    }
    if (recipeCategories) {
      const allCategories = JSON.parse(recipeCategories);
      if (allCategories.length === 0) {
        return errorResponse(res, 404, 'Nothing here');
      }
      return successResponse(res, 200, 'All Recipe Categories', allCategories);
    } else {
      const categoriesFromDb = await RecipeCategory.find({}, { __v: 0 });
      if (categoriesFromDb.length === 0) {
        return errorResponse(res, 404, 'Nothing here');
      }
      client.setex('recipe-categories', 3600, JSON.stringify(categoriesFromDb));
      return successResponse(
        res,
        200,
        'All Recipe Categories',
        categoriesFromDb,
      );
    }
  });
}
