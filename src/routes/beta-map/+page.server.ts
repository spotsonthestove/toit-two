import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
    const session = locals.session;
    const mindMapId = url.searchParams.get('id');

    if (!session) {
        throw redirect(303, '/login?redirectTo=/beta-map');
    }

    if (!mindMapId) {
        throw redirect(303, '/beta-app');
    }

    return {
        session,
        mindMapId
    };
}; 