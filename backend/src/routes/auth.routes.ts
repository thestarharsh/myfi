import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, refreshToken } from '../controllers/auth.controller';
import { authRateLimiter } from '../middleware/rateLimiter';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.post(
  '/register',
  authRateLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().notEmpty(),
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  authRateLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  validateRequest,
  login
);

router.post('/refresh', refreshToken);

export default router;


