import pool from '$lib/server/database';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

// Hash a plain text password
export async function hashPassword(password) {
    return bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}

// Create a new session
export async function createSession(userId) {
    const sessionId = randomBytes(32).toString('hex');

    await pool.query(
        'INSERT INTO sessions (id, user_id) VALUES (?, ?)',
        [sessionId, userId]
    );

    return sessionId;
}

// Get user from session
export async function getUserFromSession(sessionId) {
    if (!sessionId) return null;

    const [rows] = await pool.query(
        `SELECT 
            users.id,
            users.username,
            users.email,
            users.avatar,
            users.created_at
         FROM sessions
         JOIN users ON sessions.user_id = users.id
         WHERE sessions.id = ?`,
        [sessionId]
    );

    return rows[0] ?? null;
}

// Delete session (logout)
export async function deleteSession(sessionId) {
    await pool.query(
        'DELETE FROM sessions WHERE id = ?',
        [sessionId]
    );
}