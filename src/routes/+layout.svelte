<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { supabase } from '$lib/supabaseClient';

  export const user = writable(null);

  onMount(() => {
    supabase.auth.getSession().then(({ data }) => {
      user.set(data.session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      user.set(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  });
</script>

<slot />