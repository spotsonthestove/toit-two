import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import type { RequestEvent } from './$types';

// Add type definition for platform.env
type PlatformEnv = {
    env: {
        PUBLIC_SUPABASE_URL: string;
        PUBLIC_SUPABASE_ANON_KEY: string;
        [key: string]: string;
    };
};

export async function GET({ request, platform }: RequestEvent & { platform: PlatformEnv }) {
    try {
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return json({ error: 'No authorization token provided' }, { status: 401 });
        }

        console.log('Request headers:', {
            auth: authHeader ? 'present' : 'missing',
            tokenLength: token.length
        });

        // Create a new Supabase client with the auth headers
        const supabase = createClient(
            platform?.env?.PUBLIC_SUPABASE_URL ?? '',
            platform?.env?.PUBLIC_SUPABASE_ANON_KEY ?? '',
            {
                auth: {
                    persistSession: false,
                    autoRefreshToken: false,
                    detectSessionInUrl: false
                },
                global: {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            }
        );

        // Get user details with token
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
            console.error('User auth error:', {
                message: userError.message,
                status: userError.status,
                name: userError.name
            });
            return json({ 
                error: 'Failed to get user context',
                details: userError.message
            }, { status: 401 });
        }

        if (!user) {
            console.error('No user found after successful auth call');
            return json({ 
                error: 'No user context',
                details: 'Authentication succeeded but no user was returned'
            }, { status: 401 });
        }

        console.log('Auth context:', {
            userId: user.id,
            email: user.email,
            role: 'authenticated',
            aud: user.aud
        });

        // Use the authed client for the query
        const { data: mapsData, error: mapsError } = await supabase
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

        if (mapsError) {
            console.error('Query error:', mapsError);
            return json({ error: 'Database query failed' }, { status: 500 });
        }

        // Add detailed query logging
        console.log('Maps query details:', {
            hasData: !!mapsData,
            dataLength: mapsData?.length || 0,
            userId: user.id,
            firstItem: mapsData?.[0] ? {
                id: mapsData[0].mindmap_id,
                nodeCount: mapsData[0].mindmap_nodes?.length
            } : null
        });

        return json({ mindMaps: mapsData || [] });

    } catch (error: unknown) {
        console.error('Data endpoint error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        const errorStack = error instanceof Error ? error.stack : undefined;
        
        return json({ 
            error: errorMessage,
            stack: errorStack,
            location: 'data endpoint catch block'
        }, { status: 500 });
    }
}

// POST handler for creating new mind maps
export async function POST({ request, platform }: RequestEvent & { platform: PlatformEnv }) {
    try {
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return json({ error: 'No authorization token provided' }, { status: 401 });
        }

        // Create a new Supabase client with the auth headers
        const supabase = createClient(
            platform?.env?.PUBLIC_SUPABASE_URL ?? '',
            platform?.env?.PUBLIC_SUPABASE_ANON_KEY ?? '',
            {
                auth: {
                    persistSession: false,
                    autoRefreshToken: false,
                    detectSessionInUrl: false
                },
                global: {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            }
        );

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return json({ error: 'Invalid token or user not found' }, { status: 401 });
        }

        const { name, description, nodes } = await request.json();

        // Create mind map
        const { data: mindmap, error: mindmapError } = await supabase
            .from('mindmaps')
            .insert({ 
                name, 
                description,
                user_id: user.id
            })
            .select()
            .single();

        if (mindmapError) {
            console.error('Mindmap creation error:', mindmapError);
            throw mindmapError;
        }

        // Create nodes
        const { data: mindmapNodes, error: nodesError } = await supabase
            .from('mindmap_nodes')
            .insert(
                nodes.map((node: any) => ({
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

        if (nodesError) {
            console.error('Node creation error:', nodesError);
            throw nodesError;
        }

        return json({
            mindmap: {
                ...mindmap,
                nodes: mindmapNodes
            }
        });
    } catch (error: unknown) {
        console.error('Error in POST handler:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return json({ error: errorMessage }, { status: 500 });
    }
} 