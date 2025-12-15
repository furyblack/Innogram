import express, { Request, Response } from 'express';
import cors from 'cors';
import passport from 'passport';
import { errorHandler } from './middleware/error.middleware';
import userRoutes from './users/user.routes';

const app = express();

app.use(express.json());

app.use(passport.initialize());

app.get('/', (req: Request, res: Response) => {
    res.send('✅ Auth Service is running!');
});

app.use('/api/auth', userRoutes);

app.use(errorHandler);

export default app;
