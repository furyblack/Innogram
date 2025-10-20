// auth-service/src/strategies/google-strategy.ts
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';
import pool from '../db';

config();

// Check for required environment variables at startup
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error(
        'FATAL ERROR: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be defined in .env'
    );
}

/**
 * Finds a user by email or creates a new one if not found.
 * @param profile - The profile object received from Google.
 * @returns {Promise<object | null>} - The user object from the database or null if error.
 */
const findOrCreateUser = async (profile: Profile) => {
    const { emails, name, id: googleId } = profile;

    // Ensure email exists in the profile
    if (!emails || emails.length === 0) {
        console.error('Google profile did not return an email.');
        return null;
    }
    const email = emails[0].value;

    // 1. Find user by email
    const userResult = await pool.query(
        'SELECT * FROM "user" WHERE email = $1',
        [email]
    );

    if (userResult.rows.length > 0) {
        console.log(`User found: ${email}`);
        return userResult.rows[0];
    } else {
        // 2. Create new user if not found
        console.log(`Creating new user: ${email}`);

        // Safely create username, using email part if name is missing
        const baseUsername = name?.givenName
            ? `${name.givenName}${name.familyName || ''}`.toLowerCase()
            : email.split('@')[0];

        const username = baseUsername + Math.floor(Math.random() * 1000);
        // Use a placeholder hash, actual password login won't work for these users
        const password_hash = `google_auth_${googleId}`;

        const newUserResult = await pool.query(
            'INSERT INTO "user" (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
            [username, email, password_hash]
        );
        return newUserResult.rows[0];
    }
};

/**
 * Passport strategy instance for Google OAuth 2.0.
 */
export const GoogleStrategy = new Strategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3003/api/auth/google/callback', // Correct callback URL
        scope: ['email', 'profile'],
    },
    async (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback
    ) => {
        console.log('Google Profile Received:', profile.displayName);
        try {
            const user = await findOrCreateUser(profile);
            // Passport's done callback: (error, userOrFalse)
            done(null, user || undefined); // Pass user if found/created, otherwise undefined
        } catch (error) {
            console.error('Error during findOrCreateUser:', error);
            done(error as Error, false); // Pass error, indicate failure
        }
    }
);
