<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { user } from '$lib/stores/userStore';
  import "../app.css";

  export let data;

  onMount(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        $user = session.user;
      } else {
        $user = null;
      }
      
      invalidate('supabase:auth');
    });

    return () => subscription.unsubscribe();
  });
</script>

<slot />