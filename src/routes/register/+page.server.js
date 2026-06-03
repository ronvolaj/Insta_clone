// Handle user registration with optional profile image upload
import { hashPassword, createSession } from '$lib/server/auth';
import pool from '$lib/server/database';
import { fail, redirect } from '@sveltejs/kit';
import { put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';

export const actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();
        const username = formData.get('username');
        const email    = formData.get('email');
        const password = formData.get('password');
        const avatar   = formData.get('avatar');

        // Basic validation
        if (!username || !email || !password) {
            return fail(400, { error: 'All fields are required' });
        }

        if (password.length < 6) {
            return fail(400, { error: 'Password must be at least 6 characters' });
        }

        // Check if username or email already exists
        const [existing] = await pool.query(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existing.length > 0) {
            return fail(400, { error: 'Username or email already taken' });
        }

        // Upload avatar to Vercel Blob if provided
        let avatarPath = null;
        if (avatar && avatar.size > 0) {
            const blob = await put(`avatars/${username}-${Date.now()}`, avatar, {
                access: 'public',
                token: BLOB_READ_WRITE_TOKEN
            });
            avatarPath = blob.url;
        }

        // Hash password and insert new user
        const password_hash = await hashPassword(password);
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password_hash, avatar) VALUES (?, ?, ?, ?)',
            //                                                    ^^^^^^
            // matches your DB column name (not avatar_url)
            [username, email, password_hash, avatarPath]
        );

        // Create session and set cookie
        const sessionId = await createSession(result.insertId);
        cookies.set('session_id', sessionId, {
            path:     '/',
            httpOnly: true,
            sameSite: 'lax',
            maxAge:   60 * 60 * 24 * 30
        });

        redirect(303, '/dashboard');
    }
};