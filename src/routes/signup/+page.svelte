<script lang="ts">
  import { supabase } from '$lib/supabaseClient';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let error = null;

  async function handleSignup() {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Redirect to a confirmation page or login page
      goto('/login');
    } catch (e) {
      error = e.message;
    }
  }
</script>

<h1>Sign Up</h1>

<form on:submit|preventDefault={handleSignup}>
  <input type="email" bind:value={email} placeholder="Email" required />
  <input type="password" bind:value={password} placeholder="Password" required />
  <button type="submit">Sign Up</button>
</form>

{#if error}
  <p class="error">{error}</p>
{/if}

<style>

</style>