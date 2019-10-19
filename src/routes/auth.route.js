import { Router } from 'express';

import tryCatch from '../utils/tryCatch';
import { signup, login } from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/signup', tryCatch(signup));
authRouter.post('/login', tryCatch(login));

export default authRouter;
