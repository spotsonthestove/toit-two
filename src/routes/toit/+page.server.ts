import { redirect, error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { createMindMapList } from '$lib/supabaseClient';

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

export const actions = {
    createList: async ({ request, locals }) => {
        const session = await locals.getSession();
        if (!session?.user) {
            return fail(401, { message: 'You must be logged in to save a mind map' });
        }

        try {
            const formData = await request.formData();
            const listName = formData.get('list_name')?.toString();
            const listColor = formData.get('list_color')?.toString() || '#000000'; // Default color if none provided

            if (!listName) {
                return fail(400, { message: 'Mind map name is required' });
            }

            // Save to database using the supabase client function
            const savedList = await createMindMapList(
                listName,
                listColor,
                session.user.id
            );

            return {
                success: true,
                data: savedList
            };

        } catch (error) {
            console.error('Error saving mind map:', error);
            return fail(500, { 
                message: error instanceof Error ? 
                    error.message : 
                    'Failed to save mind map'
            });
        }
    }
} satisfies Actions;