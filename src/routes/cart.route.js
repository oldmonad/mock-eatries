import { Router } from 'express';

import tryCatch from '../utils/tryCatch';
import {
  addRecipeToCart,
  updateCart,
  removeRecipeFromCart,
  getCart,
} from '../controllers/cart.controller';

const cartRouter = Router();

cartRouter.post('/recipe', tryCatch(addRecipeToCart));

export default cartRouter;
