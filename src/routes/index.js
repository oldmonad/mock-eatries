import { Router } from 'express';

import authRouter from './auth.route';
import recipeCategoryRouter from './recipeCategory.route';
import recipeRouter from './recipe.route';
import passport from 'passport';
require('../middlewares/passport')(passport);
import { rateLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.use('/auth', authRouter);

router.use(
  '/category',
  passport.authenticate('jwt', { session: false }),
  rateLimiter,
  recipeCategoryRouter,
);

router.use(
  '/category',
  passport.authenticate('jwt', { session: false }),
  rateLimiter,
  recipeRouter,
);

export default router;
