// Handle image upload to Vercel Blob and save metadata to DB
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
    default: async ({ request, parent }) => {
        const { user } = await parent();
        if (!user) redirect(303, '/login');

        const formData = await request.formData();
        const imageFile = formData.get('image');
        const description = formData.get('description') ?? '';

// Validate that a file was actually provided

    if (!imageFile || imageFile.size === 0) {
        return fail(400, { error: 'Please select an image to upload.' });
    }

// Only allow image file types

    if (!imageFile.type.startsWith('image/')) {
    return fail(400, { error: 'Only image files are allowed.' });

    }

// Upload image to Blob storage

    const blob = await put(
    `images/${user.username}-${Date.now()}-${imageFile.name}`,
    imageFile,
    {
        access: 'public',
        token: BLOB_READ_WRITE_TOKEN
    }
);
    }
};