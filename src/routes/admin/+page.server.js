import pool from '$lib/server/database';
import { redirect, error } from '@sveltejs/kit';
import { getUserFromSession } from '$lib/server/auth';

export async function load({ parent }) {
    const { user } = await parent();

    if (!user) redirect(303, '/login');
    if (user.role !== 'admin') error(403, 'Admin access only');

    // Fetch all users with their stats and role/banned status
    const [users] = await pool.query(
        `SELECT users.id, users.username, users.email, users.role, users.banned,
                users.created_at,
                COUNT(DISTINCT images.id) AS image_count,
                COALESCE(SUM(images.votes), 0) AS total_votes
         FROM users
         LEFT JOIN images ON images.author_id = users.id
         GROUP BY users.id
         ORDER BY users.created_at ASC`
    );

    // Fetch recent images for moderation
    const [recentImages] = await pool.query(
        `SELECT images.*, users.username
         FROM images
         JOIN users ON images.author_id = users.id
         ORDER BY images.created_at DESC
         LIMIT 20`
    );

    return { users, recentImages };
}

export const actions = {
    // Delete any image
    deleteImage: async ({ request, cookies }) => {
        const sessionId = cookies.get('session_id');
        const user = await getUserFromSession(sessionId);
        if (!user || user.role !== 'admin') error(403, 'Admin only');

        const formData = await request.formData();
        const imageId = formData.get('image_id');

        await pool.query('DELETE FROM images WHERE id = ?', [imageId]);
        return { success: true };
    },

    // Delete a user and all their content
    deleteUser: async ({ request, cookies }) => {
        const sessionId = cookies.get('session_id');
        const user = await getUserFromSession(sessionId);
        if (!user || user.role !== 'admin') error(403, 'Admin only');

        const formData = await request.formData();
        const userId = formData.get('user_id');

        // Can't delete yourself
        if (parseInt(userId) === user.id) {
            return { error: 'You cannot delete yourself.' };
        }

        await pool.query('DELETE FROM users WHERE id = ?', [userId]);
        return { success: true };
    },

    // Ban or unban a user
    toggleBan: async ({ request, cookies }) => {
        const sessionId = cookies.get('session_id');
        const user = await getUserFromSession(sessionId);
        if (!user || user.role !== 'admin') error(403, 'Admin only');

        const formData = await request.formData();
        const userId = formData.get('user_id');
        const banned = formData.get('banned') === '1';

        if (parseInt(userId) === user.id) {
            return { error: 'You cannot ban yourself.' };
        }

        // Toggle banned status
        await pool.query('UPDATE users SET banned = ? WHERE id = ?', [banned ? 0 : 1, userId]);
        return { success: true };
    },

    // Promote user to admin or demote back to user
    toggleAdmin: async ({ request, cookies }) => {
        const sessionId = cookies.get('session_id');
        const user = await getUserFromSession(sessionId);
        if (!user || user.role !== 'admin') error(403, 'Admin only');

        const formData = await request.formData();
        const userId = formData.get('user_id');
        const currentRole = formData.get('current_role');

        if (parseInt(userId) === user.id) {
            return { error: 'You cannot change your own role.' };
        }

        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        await pool.query('UPDATE users SET role = ? WHERE id = ?', [newRole, userId]);
        return { success: true };
    }
};