// Redirect old upload path to the new unified upload page
import { redirect } from '@sveltejs/kit';
redirect(301, '/upload');