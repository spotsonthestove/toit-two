<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
    
    let testResult = '';
    let error = '';
    let session: any = null;

    async function testAPI() {
        try {
            // Get current session
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            session = currentSession;

            if (!session?.access_token) {
                error = 'No session found';
                return;
            }

            // Test the endpoint
            const response = await fetch('/api/test', {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            testResult = JSON.stringify(data, null, 2);
            
            console.log('API response:', {
                status: response.status,
                hasData: !!data,
                dataKeys: Object.keys(data)
            });
        } catch (e: any) {
            error = e.message || 'Unknown error occurred';
            console.error('Test error:', e);
        }
    }

    onMount(() => {
        testAPI();
    });
</script>

<div class="p-4">
    <h1 class="text-2xl mb-4">API Test Page</h1>
    
    {#if error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error: {error}
        </div>
    {/if}

    {#if session}
        <div class="mb-4">
            <h2 class="text-xl mb-2">Session Info:</h2>
            <pre class="bg-gray-100 p-2 rounded">{JSON.stringify(session, null, 2)}</pre>
        </div>
    {/if}

    <div>
        <h2 class="text-xl mb-2">Test API Response (/api/test):</h2>
        {#if testResult}
            <pre class="bg-gray-100 p-2 rounded">{testResult}</pre>
        {/if}
    </div>

    <button 
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        on:click={testAPI}
    >
        Test Again
    </button>
</div> 