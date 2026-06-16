// Load the 25 most recent images for the homepage, ordered by votes for top section
import pool from '$lib/server/database';

export async function load() {
    // Fetch top 3 images by votes for the featured section
    const [featured] = await pool.query(
        `SELECT images.*, users.username, users.avatar
         FROM images
         JOIN users ON images.author_id = users.id
         ORDER BY images.votes DESC, images.created_at DESC
         LIMIT 3`
    );

    // Fetch the 25 most recent images for the main feed
    const [recent] = await pool.query(
        `SELECT images.*, users.username, users.avatar
         FROM images
         JOIN users ON images.author_id = users.id
         ORDER BY images.created_at DESC
         LIMIT 25`
    );

    return { featured, recent };
}
