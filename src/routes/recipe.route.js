import { Router } from 'express';

import tryCatch from '../utils/tryCatch';
import {
  createRecipe,
  editRecipe,
  deleteRecipe,
  getRecipe,
  getAllRecipes,
} from '../controllers/recipe.controller';
import { adminAuth } from '../middlewares/auth';

const recipeRouter = Router();

recipeRouter.post('/:categoryId/recipe', adminAuth, tryCatch(createRecipe));

recipeRouter.patch(
  '/:categoryId/recipe/:recipeId',
  adminAuth,
  tryCatch(editRecipe),
);

recipeRouter.delete(
  '/:categoryId/recipe/:recipeId',
  adminAuth,
  tryCatch(deleteRecipe),
);

recipeRouter.get('/:categoryId/recipe/:recipeId', tryCatch(getRecipe));

recipeRouter.get('/:categoryId/recipe', tryCatch(getAllRecipes));

export default recipeRouter;
