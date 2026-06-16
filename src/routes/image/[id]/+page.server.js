// Load image details, comments, and whether the current user has voted
import pool from '$lib/server/database';
import { error, fail, redirect } from '@sveltejs/kit';
import { getUserFromSession } from '$lib/server/auth';

export async function load({ params, parent }) {
    const { user } = await parent();
    const imageId = parseInt(params.id);

    // Fetch the image with author info
    const [imageRows] = await pool.query(
        `SELECT images.*, users.username, users.avatar
         FROM images
         JOIN users ON images.author_id = users.id
         WHERE images.id = ?`,
        [imageId]
    );

    if (imageRows.length === 0) {
        error(404, 'Image not found');
    }

    // Fetch all comments with their author info
    const [comments] = await pool.query(
        `SELECT comments.*, users.username, users.avatar
         FROM comments
         JOIN users ON comments.user_id = users.id
         WHERE comments.image_id = ?
         ORDER BY comments.created_at ASC`,
        [imageId]
    );

    // Check whether the current user has already voted on this image
    let hasVoted = false;
    if (user) {
        const [voteRows] = await pool.query(
            'SELECT id FROM votes WHERE user_id = ? AND image_id = ?',
            [user.id, imageId]
        );
        hasVoted = voteRows.length > 0;
    }

    return {
        image: imageRows[0],
        comments,
        hasVoted
    };
}

export const actions = {
    // Toggle upvote on an image (one vote per user)
    vote: async ({ params, cookies }) => {
        const sessionId = cookies.get('session_id');
        const user = await getUserFromSession(sessionId);
        if (!user) return fail(401, { error: 'Login to vote' });

        const imageId = parseInt(params.id);

        // Check if already voted
        const [existing] = await pool.query(
            'SELECT id FROM votes WHERE user_id = ? AND image_id = ?',
            [user.id, imageId]
        );

        if (existing.length > 0) {
            // Remove vote (toggle off)
            await pool.query('DELETE FROM votes WHERE user_id = ? AND image_id = ?', [user.id, imageId]);
            await pool.query('UPDATE images SET votes = votes - 1 WHERE id = ?', [imageId]);
        } else {
            // Add vote
            await pool.query('INSERT INTO votes (user_id, image_id) VALUES (?, ?)', [user.id, imageId]);
            await pool.query('UPDATE images SET votes = votes + 1 WHERE id = ?', [imageId]);
        }

        return { success: true };
    },

    // Post a comment on an image
    comment: async ({ request, params, cookies }) => {
        const sessionId = cookies.get('session_id');
        const user = await getUserFromSession(sessionId);
        if (!user) return fail(401, { error: 'Login to comment' });

        const formData = await request.formData();
        const text = formData.get('text')?.toString().trim();

        if (!text) {
            return fail(400, { commentError: 'Comment cannot be empty.' });
        }

        if (text.length > 1000) {
            return fail(400, { commentError: 'Comment is too long (max 1000 characters).' });
        }

        const imageId = parseInt(params.id);

        // Insert the new comment
        await pool.query(
            'INSERT INTO comments (image_id, user_id, text) VALUES (?, ?, ?)',
            [imageId, user.id, text]
        );

        return { success: true };
    }
};