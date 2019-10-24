import { Router } from 'express';
import passport from 'passport';
import authRouter from './auth.route';
import recipeCategoryRouter from './recipeCategory.route';
import recipeRouter from './recipe.route';
import cartRoute from './cart.route';
import searchRouter from './search.route';
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

router.use(
  '/cart',
  passport.authenticate('jwt', { session: false }),
  rateLimiter,
  cartRoute,
);

router.use('/', searchRouter);

export default router;
