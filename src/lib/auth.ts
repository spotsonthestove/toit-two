import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export async function requireAuth(event: RequestEvent) {
    const session = await event.locals.getSession();
    if (!session) {
        throw redirect(303, '/login?redirectTo=' + event.url.pathname);
    }
    return session;
}
