import pool from '$lib/server/database';
import { fail, redirect } from '@sveltejs/kit';
import { put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';

export async function load({ parent }) {
    const { user } = await parent();
    if (!user) redirect(303, '/login');
    return {};
}

export const actions = {
    default: async ({ request, cookies }) => {
        // Get user directly from session cookie in the action
        const { getUserFromSession } = await import('$lib/server/auth');
        const sessionId = cookies.get('session_id');
        const user = await getUserFromSession(sessionId);

        if (!user) {
            redirect(303, '/login');
        }

        const formData = await request.formData();
        const imageFile = formData.get('image');
        const description = formData.get('description') ?? '';

        if (!imageFile || imageFile.size === 0) {
            return fail(400, { error: 'Please select an image to upload.' });
        }

        if (!imageFile.type.startsWith('image/')) {
            return fail(400, { error: 'Only image files are allowed.' });
        }

        // Upload to Vercel Blob
        const blob = await put(
            `images/${user.username}-${Date.now()}-${imageFile.name}`,
            imageFile,
            { access: 'public', token: BLOB_READ_WRITE_TOKEN }
        );

        // Save to database
        
        const filter = formData.get('filter') ?? 'none';

        await pool.query(
        'INSERT INTO images (image, description, author_id, filter) VALUES (?, ?, ?, ?)',
         [blob.url, description, user.id, filter]
      );

        redirect(303, '/dashboard');
    }
};