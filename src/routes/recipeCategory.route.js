import { Router } from 'express';

import tryCatch from '../utils/tryCatch';
import {
  createRecipeCategory,
  editRecipeCategory,
  deleteRecipeCategory,
  getRecipeCategory,
} from '../controllers/recipeCatgory.controller';
import { adminAuth } from '../middlewares/auth';

const recipeCategoryRouter = Router();

recipeCategoryRouter.post('/', adminAuth, tryCatch(createRecipeCategory));

recipeCategoryRouter.patch(
  '/:categoryId',
  adminAuth,
  tryCatch(editRecipeCategory),
);

recipeCategoryRouter.delete(
  '/:categoryId',
  adminAuth,
  tryCatch(deleteRecipeCategory),
);

recipeCategoryRouter.get('/:categoryId', tryCatch(getRecipeCategory));

export default recipeCategoryRouter;
