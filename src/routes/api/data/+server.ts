import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { RequestEvent } from './$types';

// Create a separate server-side Supabase client
const serverSupabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: false, // Server doesn't need to persist
        detectSessionInUrl: false // Server doesn't need URL detection
    }
});

// GET handler for fetching mind maps
export async function GET({ request, locals }: RequestEvent) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return json({ error: 'No authorization token' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        
        // Set auth token for this request
        serverSupabase.auth.setSession({ access_token: token, refresh_token: '' });

        // Use the same detailed query structure as the client
        let { data, error } = await serverSupabase
            .from('mindmaps')
            .select(`
                mindmap_id,
                name,
                description,
                created_at,
                mindmap_nodes (
                    node_id,
                    content,
                    x,
                    y,
                    z,
                    parent_node_id,
                    node_type
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Database query error:', error);
            throw error;
        }

        // Add debug logging
        console.log('Query result:', {
            hasData: !!data,
            count: data?.length,
            firstItem: data?.[0] ? 'exists' : 'null'
        });

        return json({ mindMaps: data || [] });
    } catch (error) {
        console.error('Error in GET handler:', error);
        return json({ error: error.message }, { status: 500 });
    }
}

// POST handler for creating new mind maps
export async function POST({ request }: RequestEvent) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return json({ error: 'No authorization token' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const { data: { user }, error: authError } = await serverSupabase.auth.getUser(token);
        if (authError || !user) {
            return json({ error: 'Invalid token' }, { status: 401 });
        }

        const { name, description, nodes } = await request.json();

        // Create mind map
        const { data: mindmap, error: mindmapError } = await serverSupabase
            .from('mindmaps')
            .insert({ 
                name, 
                description,
                user_id: user.id
            })
            .select()
            .single();

        if (mindmapError) throw mindmapError;

        // Create nodes
        const { data: mindmapNodes, error: nodesError } = await serverSupabase
            .from('mindmap_nodes')
            .insert(
                nodes.map(node => ({
                    mindmap_id: mindmap.mindmap_id,
                    content: node.title || 'New Node',
                    title: node.title || 'New Node',
                    description: node.description || '',
                    x: node.x || 0,
                    y: node.y || 0,
                    z: node.z || 0,
                    node_type: node.nodeType,
                    parent_node_id: node.parentId
                }))
            )
            .select();

        if (nodesError) throw nodesError;

        return json({
            mindmap: {
                ...mindmap,
                nodes: mindmapNodes
            }
        });
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
} 