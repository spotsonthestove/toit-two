<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { user } from '$lib/stores/userStore';
  import { supabase } from '$lib/supabaseClient';

  let email = '';
  let password = '';
  let error: string | null = null;
  let loading = false;

  $: redirectTo = $page.url.searchParams.get('redirectTo') || '/';

  async function handleLogin(event: SubmitEvent) {
    event.preventDefault();
    error = null;
    loading = true;

    try {
      console.log('Login attempt with email:', email);
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      if (data.user) {
        console.log('Login successful, user:', data.user);
        $user = data.user;
        
        // Get and store session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Let Supabase handle the session storage
          await supabase.auth.setSession(session);
          
          // Set cookies with full domain path and no httpOnly
          const domain = window.location.hostname;
          const cookieOptions = `path=/; domain=${domain}; max-age=3600; SameSite=Lax`;
          
          // Set cookies and log them
          try {
            document.cookie = `sb-access-token=${session.access_token}; ${cookieOptions}`;
            document.cookie = `sb-refresh-token=${session.refresh_token}; ${cookieOptions}`;
            
            // Debug cookie setting
            console.log('Setting cookies with options:', cookieOptions);
            console.log('Current cookies:', document.cookie);
            
            // Verify cookies were set
            const cookies = document.cookie.split(';').reduce((acc, cookie) => {
              const [key, value] = cookie.trim().split('=');
              acc[key] = value;
              return acc;
            }, {} as Record<string, string>);
            
            console.log('Cookie verification:', {
              hasAccessToken: 'sb-access-token' in cookies,
              hasRefreshToken: 'sb-refresh-token' in cookies
            });
            
            // Wait to ensure cookies are set
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Make a test request to verify cookies
            const response = await fetch('/api/test-auth', {
              credentials: 'include'
            });
            
            console.log('Auth test response:', await response.json());
            
          } catch (cookieError) {
            console.error('Error setting cookies:', cookieError);
          }
          
          // Redirect with cookies
          if (redirectTo && redirectTo !== '/') {
            window.location.href = redirectTo;
          } else {
            window.location.href = '/';
          }
        }
      }
    } catch (e) {
      console.error('Login error:', e);
      error = e instanceof Error ? e.message : 'An error occurred during login';
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-md mx-auto mt-8 p-8 glass-panel">
  <h1 class="text-3xl font-bold text-white mb-6 text-center">Login</h1>

  <form on:submit={handleLogin} class="space-y-4">
    <div>
      <input 
        type="email" 
        bind:value={email} 
        placeholder="Email" 
        required 
        disabled={loading}
        class="input-field"
      />
    </div>
    <div>
      <input 
        type="password" 
        bind:value={password} 
        placeholder="Password" 
        required 
        disabled={loading}
        class="input-field"
      />
    </div>
    <button type="submit" disabled={loading} class="btn-primary w-full">
      {loading ? 'Logging in...' : 'Log in'}
    </button>
  </form>

  {#if error}
    <p class="mt-4 text-red-400">{error}</p>
  {/if}

  <p class="mt-4 text-center text-white">
    Don't have an account? <a href="/signup" class="text-toit-300 hover:text-toit-200">Sign up</a>
  </p>
</div>