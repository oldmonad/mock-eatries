import { Router } from 'express';

import tryCatch from '../utils/tryCatch';
import { search } from '../controllers/search.controller';

const searchRouter = Router();

searchRouter.get('/search', tryCatch(search));

export default searchRouter;
