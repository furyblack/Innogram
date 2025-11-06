import express, { Request, Response } from 'express';
import cors from 'cors';
import passport from 'passport';
//import { GoogleStrategy } from './strategies/google-strategy'; // Use correct filename
import { errorHandler } from './middleware/error.middleware';
import userRoutes from './users/user.routes';

const app = express();

// Enable CORS
app.use(
    cors({
        origin: 'http://localhost:1024',
    })
);

// Parse JSON bodies
app.use(express.json());

// Initialize Passport
app.use(passport.initialize());
//passport.use(GoogleStrategy); // Register the strategy instance

// Simple root route
app.get('/', (req: Request, res: Response) => {
    res.send('✅ Auth Service is running!');
});

// Mount user/auth routes
app.use('/api/auth', userRoutes);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
