import pool from '$lib/server/database';
import { redirect, error } from '@sveltejs/kit';
import { getUserFromSession } from '$lib/server/auth';

export async function load({ parent }) {
    const { user } = await parent();

    if (!user) redirect(303, '/login');
    if (user.id !== 1) error(403, 'Admin access only');

    const [users] = await pool.query(
        `SELECT users.id, users.username, users.email, users.created_at,
                COUNT(DISTINCT images.id) AS image_count,
                COALESCE(SUM(images.votes), 0) AS total_votes
         FROM users
         LEFT JOIN images ON images.author_id = users.id
         GROUP BY users.id
         ORDER BY users.created_at ASC`
    );

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
    deleteImage: async ({ request, cookies }) => {
        const sessionId = cookies.get('session_id');
        const user = await getUserFromSession(sessionId);
        if (!user || user.id !== 1) error(403, 'Admin only');
        const formData = await request.formData();
        const imageId = formData.get('image_id');
        await pool.query(
            'DELETE FROM images WHERE id = ?',
            [imageId]
        );

        return { success: true };
    }
};