import { Router } from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { body } from 'express-validator';
import passport from 'passport';
import { validateRequest } from '../middleware/validate.middleware';

const router = Router();

router.post(
    '/register',
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('username').notEmpty().withMessage('Username is required'),
    body('display_name').notEmpty().withMessage('Display name is required'),
    body('birthday').isISO8601().withMessage('Birthday must be a valid date'),

    validateRequest,
    UserController.register
);
router.post(
    '/login',
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validateRequest,
    UserController.login
);
router.post('/social-login', UserController.socialLogin);

router.post('/logout', UserController.logout);

export default router;
