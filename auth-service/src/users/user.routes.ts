import { Router } from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { body } from 'express-validator';
import passport from 'passport';
import { validateRequest } from '../middleware/validate.middleware';

const router = Router();

// Your existing routes
router.post(
    '/register',
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('username').notEmpty().withMessage('Username is required'),
    body('display_name').notEmpty().withMessage('Display name is required'),
    body('birthday').isISO8601().withMessage('Birthday must be a valid date'),
    // 3. ОБРАБОТЧИК ВАЛИДАЦИИ
    validateRequest, // 4. КОНТРОЛЛЕР
    UserController.register
);
router.post(
    '/login',
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validateRequest, // <-- ДОБАВИТЬ ЗДЕСЬ
    UserController.login
);
router.post('/social-login', UserController.socialLogin);
// router.get('/me', authMiddleware, UserController.getMe);

// Google OAuth Routes
// router.get(
//     '/google',
//     passport.authenticate('google', {
//         scope: ['profile', 'email'], // Request profile and email scopes from Google
//         session: false, // We use JWT, not sessions
//     })
// );

// router.get(
//     '/google/callback',
//     passport.authenticate('google', {
//         session: false, // No sessions
//         failureRedirect: 'http://localhost:1024/login?error=google-auth-failed', // Redirect front-end on failure
//     }),
//     (req, res) => {
//         // req.user now contains the user object from findOrCreateUser
//         // Here you should generate your JWT tokens based on req.user
//         console.log('Google callback successful, user:', req.user);

//         // TEMPORARY: Send user data back (replace with token generation)
//         res.json({ message: 'Google auth successful!', user: req.user });

//         // REAL IMPLEMENTATION:
//         // const { accessToken, refreshToken } = await generateTokens(req.user);
//         // res.redirect(`http://localhost:1024/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`); // Redirect to frontend with tokens
//     }
// );

export default router;
