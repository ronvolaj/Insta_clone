import pool from '$lib/server/database';
import { redirect } from '@sveltejs/kit';

export async function load({ parent }) {
    const { user } = await parent();
    if (!user) {
        redirect(303, '/login');
    }
    return {};
}

const [images] = await pool.query(
    `SELECT images.*,
            COUNT(DISTINCT comments.id) AS comment_count
     FROM images
     LEFT JOIN comments ON comments.image_id = images.id
     WHERE images.author_id = ?
     GROUP BY images.id
     ORDER BY images.created_at DESC`,
    [user.id]
);

return { images };