import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import type { RequestEvent } from './$types';

export async function GET({ request, platform }: RequestEvent) {
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

        return json({
            debug: {
                auth: {
                    token: 'present',
                    userId: user.id,
                    role: 'authenticated',
                    aud: user.aud
                },
                query: {
                    data: mapsData,
                    error: mapsError,
                    count: mapsData?.length
                }
            },
            mindMaps: mapsData || []
        });

    } catch (error: unknown) {
        console.error('Test endpoint error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        const errorStack = error instanceof Error ? error.stack : undefined;
        
        return json({ 
            error: errorMessage,
            stack: errorStack,
            location: 'test endpoint catch block'
        }, { status: 500 });
    }
} 