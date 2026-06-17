// Redirect old upload path to the new unified upload page
import { redirect } from '@sveltejs/kit';

export async function load() {
    throw redirect(301, '/upload');
}