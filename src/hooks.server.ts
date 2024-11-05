import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    try {
        // Create supabase server client
        const supabase = createSupabaseServerClient({
            supabaseUrl: PUBLIC_SUPABASE_URL,
            supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
            event
        });

        // Set supabase instance in locals
        event.locals.supabase = supabase;

        // Debug: Log all cookies with parsing
        const allCookies = event.request.headers.get('cookie');
        const parsedCookies = allCookies?.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
        }, {} as Record<string, string>) || {};

        console.log('All cookies:', {
            rawCookies: allCookies,
            parsed: parsedCookies
        });

        // Try to get the session from the cookie
        const accessToken = parsedCookies['sb-access-token'] || event.cookies.get('sb-access-token');
        const refreshToken = parsedCookies['sb-refresh-token'] || event.cookies.get('sb-refresh-token');

        console.log('Cookie check:', {
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
            accessTokenStart: accessToken ? accessToken.substring(0, 10) + '...' : 'none',
            refreshTokenStart: refreshToken ? refreshToken.substring(0, 10) + '...' : 'none',
            cookieSource: accessToken ? 'Found in cookies' : 'Not found'
        });

        let session = null;
        if (accessToken && refreshToken) {
            try {
                const { data, error } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken
                });
                if (!error && data?.session) {
                    session = data.session;
                    console.log('Session restored from cookies');
                } else {
                    console.error('Error setting session from cookies:', error);
                }
            } catch (e) {
                console.error('Error processing tokens:', e);
            }
        }

        // Fallback to getting session from Supabase
        if (!session) {
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            session = currentSession;
            console.log('Using fallback session:', !!session);
        }

        event.locals.session = session;
        event.locals.getSession = async () => session;

        console.log('Final hook session details:', {
            exists: !!session,
            userId: session?.user?.id,
            hasToken: !!session?.access_token,
            hasCookie: !!accessToken
        });

        // Handle the response
        const response = await resolve(event, {
            filterSerializedResponseHeaders(name) {
                return name === 'content-range';
            }
        });

        return response;
    } catch (error) {
        console.error('Hook error:', error);
        event.locals.session = null;
        event.locals.getSession = async () => null;
        return await resolve(event);
    }
}; 