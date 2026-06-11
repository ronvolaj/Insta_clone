import pool from '$lib/server/database';
import { redirect, error } from '@sveltejs/kit';

export async function load({ parent }) {
    const { user } = await parent();

    if (!user) redirect(303, '/login');
    if (user.id !== 1) error(403, 'Admin access only');

    return {};
}