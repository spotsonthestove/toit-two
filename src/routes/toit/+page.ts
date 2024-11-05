import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export const load: PageLoad = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        throw redirect(303, '/login?redirectTo=/toit');
    }

    return {
        session
    };
}; 