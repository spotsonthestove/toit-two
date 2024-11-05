import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    try {
        if (!locals.getSession) {
            console.error('getSession function not available');
            throw error(500, 'Session handling not properly initialized');
        }

        const session = await locals.getSession();
        
        console.log('Server load - session details:', {
            exists: !!session,
            userId: session?.user?.id,
            hasToken: !!session?.access_token
        });

        if (!session) {
            if (!locals.session) {
                throw redirect(303, '/login?redirectTo=/toit');
            } else {
                throw error(500, 'Session validation failed');
            }
        }

        return {
            session: session
        };
    } catch (e) {
        console.error('Error in toit page load:', e);
        
        if (e instanceof Response) {
            throw e;
        }
        
        throw error(500, e instanceof Error ? e.message : 'Failed to load toit page');
    }
};