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

<svelte:head>
  <!-- Favicon: Using your logo from the static directory -->
  <link rel="icon" href="/logo.jpg" type="image/jpeg">
</svelte:head>

<slot />