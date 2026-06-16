// Load the current user from session cookie for every page
import { getUserFromSession } from '$lib/server/auth';

export async function load({ cookies }) {
    const sessionId = cookies.get('session_id');
    const user = await getUserFromSession(sessionId);
    return { user };
}