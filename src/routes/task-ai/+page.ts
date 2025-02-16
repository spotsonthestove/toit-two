import type { PageLoad } from './$types';
import { supabase } from '$lib/supabaseClient';

export const load = (async () => {
    const { data: tasks, error } = await supabase
        .from('mindmap_nodes')
        .select('*')
        .eq('node_type', 'task')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading tasks:', error);
        return {
            tasks: []
        };
    }

    return {
        tasks: tasks || []
    };
}) satisfies PageLoad; 