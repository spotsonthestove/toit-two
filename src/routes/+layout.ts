import { supabase } from '$lib/supabaseClient';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ depends }) => {
    depends('supabase:auth');

    try {
        const {
            data: { session },
            error: sessionError
        } = await supabase.auth.getSession();

        if (sessionError) {
            console.error('Layout session error:', sessionError);
            return {
                session: null
            };
        }

        return {
            session
        };
    } catch (error) {
        console.error('Layout load error:', error);
        return {
            session: null
        };
    }
}; 