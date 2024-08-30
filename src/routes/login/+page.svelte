<script lang="ts">
  let email = '';
  let password = '';

  function handleSubmit() {
    // TODO: Implement login logic
    console.log('Login attempt', { email, password });
  }
</script>

<main>
  <h1>Login</h1>
  <form on:submit|preventDefault={handleSubmit}>
    <div>
      <label for="email">Email:</label>
      <input type="email" id="email" bind:value={email} required>
    </div>
    <div>
      <label for="password">Password:</label>
      <input type="password" id="password" bind:value={password} required>
    </div>
    <button type="submit">Login</button>
  </form>
  <a href="/">Back to Home</a>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: linear-gradient(135deg, #4caf50, #1a1a1a);
    color: white;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 10px;
    padding: 2rem;
    margin-bottom: 1rem;
  }

  input {
    padding: 0.5rem;
    border-radius: 5px;
    border: none;
  }

  button {
    padding: 0.5rem 1rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  a {
    color: white;
    text-decoration: none;
  }
</style>