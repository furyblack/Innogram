// auth-service/src/users/user.routes.ts
import { Router } from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { body } from 'express-validator';
import passport from 'passport';

const router = Router();

// Your existing routes
router.post(
    '/register',
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('name').notEmpty().withMessage('Name is required'),
    UserController.register
);
router.post('/login', UserController.login);
router.get('/me', authMiddleware, UserController.getMe);

// Google OAuth Routes
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'], // Request profile and email scopes from Google
        session: false, // We use JWT, not sessions
    })
);

router.get(
    '/google/callback',
    passport.authenticate('google', {
        session: false, // No sessions
        failureRedirect: 'http://localhost:1024/login?error=google-auth-failed', // Redirect front-end on failure
    }),
    (req, res) => {
        // req.user now contains the user object from findOrCreateUser
        // Here you should generate your JWT tokens based on req.user
        console.log('Google callback successful, user:', req.user);

        // TEMPORARY: Send user data back (replace with token generation)
        res.json({ message: 'Google auth successful!', user: req.user });

        // REAL IMPLEMENTATION:
        // const { accessToken, refreshToken } = await generateTokens(req.user);
        // res.redirect(`http://localhost:1024/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`); // Redirect to frontend with tokens
    }
);

export default router;
