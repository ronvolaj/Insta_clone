// Load a user's public profile and all their images
import pool from '$lib/server/database';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    const { username } = params;

    // Fetch the profile user's info
    const [userRows] = await pool.query(
        'SELECT id, username, email, avatar, created_at FROM users WHERE username = ?',
        [username]
    );

    if (userRows.length === 0) {
        error(404, 'User not found');
    }

    const profileUser = userRows[0];

    // Fetch all images by this user, ordered by newest first
    const [images] = await pool.query(
        `SELECT images.*,
                COUNT(DISTINCT comments.id) AS comment_count
         FROM images
         LEFT JOIN comments ON comments.image_id = images.id
         WHERE images.author_id = ?
         GROUP BY images.id
         ORDER BY images.created_at DESC`,
        [profileUser.id]
    );

    // Total votes received across all images
    const totalVotes = images.reduce((sum, img) => sum + (img.votes ?? 0), 0);

    return { profileUser, images, totalVotes };
}
