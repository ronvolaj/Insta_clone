// Handle user logout by deleting the session
import { deleteSession } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ cookies }) => {
        const sessionId = cookies.get('session_id');

        // Delete session from the database
        if (sessionId) {
            await deleteSession(sessionId);
        }

        // Clear the cookie
        cookies.delete('session_id', { path: '/' });

        redirect(303, '/login');
    }
};
