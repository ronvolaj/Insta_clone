import pool from '$lib/server/database';
import { redirect } from '@sveltejs/kit';

export async function load({ parent }) {
    const { user } = await parent();
    if (!user) {
        redirect(303, '/login');
    }
    return {};
}