import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.getSession();

    if (!session) {
        throw redirect(303, '/login');
    }

    return {
        user: session.user
    };
}; 