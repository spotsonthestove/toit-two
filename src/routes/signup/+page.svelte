<script lang="ts">
  import { supabase } from '$lib/supabaseClient';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let username = '';
  let firstName = '';
  let lastName = '';
  let loading = false;
  let error = null;

  async function handleSignup() {
    loading = true;
    try {
      // Just handle the auth signup - the trigger will create the profile
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            first_name: firstName,
            last_name: lastName
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!user) throw new Error('No user returned after signup');

      // Redirect to login
      goto('/login?message=Please check your email to verify your account');
      
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  // Optional: Check if username is available
  async function checkUsername() {
    if (username.length < 3) return;
    
    const { data, error: checkError } = await supabase
      .from('user_profiles')
      .select('username')
      .eq('username', username)
      .single();

    if (data) {
      error = 'Username already taken';
    }
  }
</script>

<h1>Sign Up</h1>

<form on:submit|preventDefault={handleSignup}>
  <div class="form-group">
    <input
      type="text"
      bind:value={username}
      on:blur={checkUsername}
      placeholder="Username"
      required
      minlength="3"
      maxlength="255"
    />
  </div>

  <div class="form-group">
    <input
      type="text"
      bind:value={firstName}
      placeholder="First Name"
    />
  </div>

  <div class="form-group">
    <input
      type="text"
      bind:value={lastName}
      placeholder="Last Name"
    />
  </div>

  <div class="form-group">
    <input
      type="email"
      bind:value={email}
      placeholder="Email"
      required
    />
  </div>

  <div class="form-group">
    <input
      type="password"
      bind:value={password}
      placeholder="Password"
      required
      minlength="6"
    />
  </div>

  <button type="submit" disabled={loading}>
    {loading ? 'Signing up...' : 'Sign Up'}
  </button>
</form>

{#if error}
  <p class="error">{error}</p>
{/if}

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 300px;
    margin: 2rem auto;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  button {
    padding: 0.5rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }

  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  button:hover:not(:disabled) {
    background-color: #45a049;
  }

  .error {
    color: red;
    text-align: center;
    margin-top: 1rem;
  }
</style>